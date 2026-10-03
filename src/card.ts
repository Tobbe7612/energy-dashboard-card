import { LitElement, html, css, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  DashboardRequestGuard,
  DashboardSubscription,
} from "./dashboard-subscription";
import {
  getTimelineBounds,
  isConsumptionTimestampInTimeline,
  isFuturePriceInTimeline,
  isTimestampInTimeline,
  shouldShowNowMarker,
  DEFAULT_DASHBOARD_VIEW,
  type DashboardView,
} from "./timeline-view";
import {
  formatIntervalWithFormatter,
  formatTimeLabelWithFormatter,
} from "./time-formatters";
import type {
  DashboardConsumer,
  DashboardInsight,
  DashboardPayload,
  EnergyDashboardCardConfig,
  HomeAssistant,
} from "./types";

const SWEDISH_TIME_FORMATTER = new Intl.DateTimeFormat("sv-SE", {
  hour: "2-digit",
  minute: "2-digit",
});

@customElement("energy-dashboard-card")
export class EnergyDashboardCard extends LitElement {
  private config!: EnergyDashboardCardConfig;

  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private data?: DashboardPayload;

  @state()
  private error?: string;

  @state()
  private loading = false;

  @state()
  private view: DashboardView = DEFAULT_DASHBOARD_VIEW;

  private readonly dashboardSubscription = new DashboardSubscription();
  private readonly dashboardRequestGuard = new DashboardRequestGuard();

  public setConfig(config: EnergyDashboardCardConfig): void {
    if (!config || config.type !== "custom:energy-dashboard-card") {
      throw new Error("Invalid configuration for energy-dashboard-card");
    }

    if (!config.config_entry_id) {
      throw new Error("config_entry_id is required");
    }

    if (this.config?.config_entry_id !== config.config_entry_id) {
      this.dashboardSubscription.unsubscribeNow();
      this.invalidateFallbackRequests();
      this.data = undefined;
    }
    this.config = config;
    if (this.isConnected) void this.ensureDashboardSubscription();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.invalidateFallbackRequests();
    void this.ensureDashboardSubscription();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.dashboardSubscription.unsubscribeNow();
    this.invalidateFallbackRequests();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("hass")) {
      const previousHass = changed.get("hass") as HomeAssistant | undefined;
      if (
        (previousHass?.connection ?? previousHass) !==
        (this.hass?.connection ?? this.hass)
      ) {
        this.invalidateFallbackRequests();
      }
      if (this.hass) {
        void this.ensureDashboardSubscription();
      } else {
        this.dashboardSubscription.unsubscribeNow();
      }
    }
  }

  private async ensureDashboardSubscription(): Promise<void> {
    if (!this.isConnected || !this.hass || !this.config?.config_entry_id) {
      return;
    }

    const connection = this.hass.connection;
    if (!connection?.subscribeMessage) {
      this.dashboardSubscription.unsubscribeNow();
      if (!this.data && !this.loading) void this.loadDashboardData();
      return;
    }

    if (!this.dashboardSubscription.isUsing(connection)) {
      this.dashboardSubscription.unsubscribeNow();
    }

    await this.dashboardSubscription.subscribe(
      connection,
      this.config.config_entry_id,
      (payload) => {
        if (this.isConnected) {
          this.data = payload;
          this.error = undefined;
        }
      },
      () => {
        if (this.isConnected && !this.data) {
          this.error = undefined;
          void this.loadDashboardData();
        }
      },
    );
  }

  private invalidateFallbackRequests(): void {
    this.dashboardRequestGuard.invalidate();
    this.loading = false;
  }

  private async loadDashboardData(): Promise<void> {
    if (!this.hass) return;

    const hass = this.hass;
    const configEntryId = this.config.config_entry_id;
    await this.dashboardRequestGuard.run(
      hass.connection ?? hass,
      configEntryId,
      () => ({
        connection: this.hass?.connection ?? this.hass,
        configEntryId: this.config?.config_entry_id,
        isConnected: this.isConnected,
      }),
      () => hass.callWS<DashboardPayload>({
        type: "solar_battery_economy/get_dashboard_data",
        config_entry_id: configEntryId,
      }),
      {
        onStart: () => {
          this.loading = true;
          this.error = undefined;
        },
        onSuccess: (payload) => { this.data = payload; },
        onFailure: (error) => {
          this.error =
            error instanceof Error
              ? error.message
              : JSON.stringify(error, null, 2);
        },
        onFinish: () => { this.loading = false; },
      },
    );
  }

  protected render() {
    if (this.loading) {
      return html`
        <ha-card>
          <div class="content loading">
            Laddar Energy Dashboard…
          </div>
        </ha-card>
      `;
    }

    if (this.error) {
      return html`
        <ha-card>
          <div class="content">
            <div class="title">Energy Dashboard</div>
            <div class="error">${this.error}</div>
          </div>
        </ha-card>
      `;
    }

    if (!this.data) {
      return html`
        <ha-card>
          <div class="content">
            Ingen dashboarddata ännu.
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="dashboard-layout">
          <div class="dashboard-overview">
            ${this.renderPriceHeader()}
          </div>

          <div class="dashboard-smart-score">
            ${this.renderSmartScoreSection()}
          </div>

          <div class="dashboard-timeline-prices">
            <div class="dashboard-timeline">
              ${this.renderTimelineSection()}
            </div>

          ${this.view === "today-forward"
            ? html`<div class="dashboard-upcoming">
                ${this.renderUpcomingPricesSection()}
              </div>`
            : ""}
          </div>

          <div class="dashboard-lower-grid">
            <div class="dashboard-consumers">
              ${this.renderConsumersSection()}
            </div>

            <div class="dashboard-insights">
              ${this.renderInsightsSection()}
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  // ---------------------------------------------------------------------------
  // PRICE HEADER
  // ---------------------------------------------------------------------------

  private renderPriceHeader() {
    if (!this.data) return html``;

    const current = this.data.price.current;
    const intelligence = this.data.price_intelligence;
    const statistics = intelligence.today_import_price_statistics;

    const priceClass = this.getPriceClassLabel(current.price_class);
    const priceClassKey = current.price_class.toLowerCase();
    const pqi = intelligence.price_quality_index;
    const gaugeAngle = 135 + (100 - pqi) * 2.7;

    return html`
      <section class="price-header">
        <div class="overview-layout">
          <div class="current-price-card ${priceClassKey}">
            <div class="eyebrow">IMPORTPRIS JUST NU</div>

            <div class="price-gauge" style="--pqi-angle: ${gaugeAngle}deg">
              <div class="price-gauge-ring" aria-hidden="true"></div>
              <div class="price-gauge-marker" aria-hidden="true"></div>

              <div class="price-gauge-center">
                <div class="current-price-row">
                  <div class="current-price">
                    ${this.formatPrice(current.import)}
                    <span class="unit">kr/kWh</span>
                  </div>

                  <div class="price-status ${priceClassKey}">
                    <div class="status-label">${priceClass}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="current-time">
              ${this.formatInterval(current.start, current.end)}
            </div>
          </div>

          <div class="overview-support">
            <div class="price-quality-summary">
              <div class="pqi-label">PRISINDEX (PQI)</div>
              <div class="pqi-value">
                ${this.formatNumber(intelligence.price_quality_index, 0)}<span>/100</span>
              </div>
            </div>

            <div class="price-stats">
              <div class="stat">
                <div class="stat-label">Lägsta</div>
                <div class="stat-value">
                  ${this.formatPrice(statistics.lowest_import_price)}
                </div>
              </div>

              <div class="stat">
                <div class="stat-label">Snitt</div>
                <div class="stat-value">
                  ${this.formatPrice(statistics.average_import_price)}
                </div>
              </div>

              <div class="stat">
                <div class="stat-label">Högsta</div>
                <div class="stat-value">
                  ${this.formatPrice(statistics.highest_import_price)}
                </div>
              </div>
            </div>

            ${this.renderKpiSection()}
          </div>
        </div>
      </section>
    `;
  }

  // ---------------------------------------------------------------------------
  // TIMELINE
  // ---------------------------------------------------------------------------

  private renderTimelineSection() {
    if (!this.data) return html``;

    const timeline = this.buildTimelineModel();
    if (!timeline) {
      return html`
        <section class="timeline-section">
          <div class="section-title">IMPORTPRIS & HUSFÖRBRUKNING</div>
          <div class="timeline-empty">
            Ingen tillräcklig tidsseriedata tillgänglig.
          </div>
        </section>
      `;
    }

    const consumerSeries = this.getConsumerTimelineSeries(timeline);

    return html`
      <section class="timeline-section">
        <div class="timeline-heading">
          <div>
            <div class="section-title">
              IMPORTPRIS & HUSFÖRBRUKNING
            </div>
            <div class="timeline-subtitle">
              ${this.view === "yesterday"
                ? "Gårdagens lokala dygn"
                : "Idag och tillgängliga framtida importpriser"}
            </div>
          </div>
          <div class="timeline-view-selector" role="group" aria-label="Tidsvy">
            <button
              type="button"
              aria-pressed="${this.view === "yesterday"}"
              class=${this.view === "yesterday" ? "selected" : ""}
              @click=${() => this.setView("yesterday")}
            >IGÅR</button>
            <button
              type="button"
              aria-pressed="${this.view === "today-forward"}"
              class=${this.view === "today-forward" ? "selected" : ""}
              @click=${() => this.setView("today-forward")}
            >IDAG + FRAMÅT</button>
          </div>
          <div class="timeline-legend">
            <span class="legend-item">
              <span class="legend-line history"></span>
              Historik
            </span>
            <span class="legend-item">
              <span class="legend-line future"></span>
              Prognos
            </span>
            <span class="legend-item">
              <span class="legend-bar"></span>
              Förbrukning
            </span>
            ${consumerSeries.map(({ consumer, index }) => html`
              <span class="legend-item">
                <span
                  class="legend-consumer"
                  style="--consumer-accent: ${this.getConsumerColor(index)}"
                ></span>
                ${consumer.name || this.getConsumerFallbackName(consumer)}
              </span>
            `)}
          </div>
        </div>

        <div class="timeline-chart">
          ${svg`
            <svg
              viewBox="0 0 ${timeline.width} ${timeline.height}"
              preserveAspectRatio="none"
              role="img"
              aria-label="Tidslinje för importpris och husförbrukning"
            >
              ${this.renderTimelineGrid(timeline)}
              ${this.renderHouseBars(timeline)}
              ${this.renderConsumerSeries(timeline, consumerSeries)}
              ${this.renderHistoricalImportPrice(timeline)}
              ${this.renderFutureImportPrice(timeline)}
              ${shouldShowNowMarker(this.view)
                ? this.renderNowMarker(
                    timeline,
                    this.data.price.current.price_class.toLowerCase(),
                  )
                : svg``}
              ${this.renderTimelineLabels(timeline)}
            </svg>
          `}
        </div>
      </section>
    `;
  }

  private buildTimelineModel() {
    if (!this.data) return undefined;

    const bounds = getTimelineBounds(this.data, this.view);
    const now = Date.now();

    if (!bounds) return undefined;
    const { start, end } = bounds;

    const forecast = (shouldShowNowMarker(this.view)
      ? this.data.price.forecast
      : [])
      .filter((item) => {
        const forecastStart = new Date(item.start).getTime();
        const forecastEnd = new Date(item.end).getTime();
        return isFuturePriceInTimeline(forecastStart, forecastEnd, bounds, now);
      })
      .sort(
        (a, b) =>
          new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

    const width = 1000;
    const height = 250;
    const plot = {
      left: 52,
      right: 46,
      top: 18,
      bottom: 34,
    };

    const plotWidth = width - plot.left - plot.right;
    const plotHeight = height - plot.top - plot.bottom;

    const x = (timestamp: number) =>
      plot.left +
      ((timestamp - start) / (end - start)) * plotWidth;

    const importValues = [
      ...this.data.price_history.import_intervals
        .filter((item) =>
          isTimestampInTimeline(new Date(item.start).getTime(), bounds),
        )
        .map((item) => item.import),
      ...forecast.map((item) => item.import),
    ].filter((value) => Number.isFinite(value) && value >= 0);

    const currentImportStart = new Date(this.data.price.current.start).getTime();
    const currentImport = isTimestampInTimeline(currentImportStart, bounds)
      ? this.data.price.current.import
      : 0;
    const maxImport = Math.max(
      currentImport,
      ...importValues,
      0.01,
    );
    const importMax = this.roundChartMax(maxImport);

    const houseValues = this.data.house_history
      .filter((item) =>
        isTimestampInTimeline(new Date(item.start).getTime(), bounds),
      )
      .map((item) => item.energy_kwh)
      .filter((value) => Number.isFinite(value) && value > 0);

    const maxHouse = Math.max(...houseValues, 0.01);
    const houseMax = this.roundChartMax(maxHouse);

    const yImport = (value: number) =>
      plot.top + plotHeight - (value / importMax) * plotHeight;

    const yHouse = (value: number) =>
      plot.top + plotHeight - (value / houseMax) * plotHeight;

    return {
      width,
      height,
      plot,
      plotWidth,
      plotHeight,
      start,
      end,
      now: !shouldShowNowMarker(this.view)
        ? end
        : Math.min(Math.max(now, start), end),
      bounds,
      x,
      yImport,
      yHouse,
      importMax,
      houseMax,
      historyEnd: end,
      forecast,
    };
  }

  private roundChartMax(value: number): number {
    if (!Number.isFinite(value) || value <= 0) return 1;

    const step =
      value <= 2
        ? 0.5
        : value <= 5
          ? 1
          : value <= 10
            ? 2
            : 5;

    return Math.ceil(value / step) * step;
  }

  private getTimelineHourTicks(timeline: ReturnType<typeof this.buildTimelineModel>) {
    if (!timeline) return [];

    const firstHour = new Date(timeline.start);
    firstHour.setMinutes(0, 0, 0);

    let timestamp = firstHour.getTime();
    if (timestamp < timeline.start) {
      firstHour.setHours(firstHour.getHours() + 1);
      timestamp = firstHour.getTime();
    }

    const ticks: number[] = [];
    for (
      let tick = timestamp;
      tick <= timeline.end;
      tick += 60 * 60 * 1000
    ) {
      if (new Date(tick).getMinutes() === 0) ticks.push(tick);
    }

    const desktopStride = Math.max(1, Math.ceil(ticks.length / 26));

    return ticks.map((tick, index) => ({
      timestamp: tick,
      desktop: index % desktopStride === 0,
      narrow: index % (desktopStride * 2) === 0,
      mobile: index % (desktopStride * 3) === 0,
    }));
  }

  private getConsumerTimelineSeries(
    timeline: ReturnType<typeof this.buildTimelineModel>,
  ) {
    if (!timeline || !this.data) return [];

    return Object.values(this.data.consumers)
      .map((consumer, index) => {
        const points = consumer.history
          .map((point) => ({
            start: new Date(point.start).getTime(),
            end: new Date(point.end).getTime(),
            energy_kwh: point.energy_kwh,
          }))
          .filter(
            (point) =>
              Number.isFinite(point.start) &&
              Number.isFinite(point.end) &&
              point.end > point.start &&
              Number.isFinite(point.energy_kwh) &&
              point.energy_kwh > 0 &&
              isConsumptionTimestampInTimeline(
                point.start,
                timeline.bounds,
                timeline.now,
              ),
          );

        return { consumer, index, points };
      })
      .filter(({ points }) => points.some((point) => point.energy_kwh > 0));
  }

  private renderConsumerSeries(
    timeline: ReturnType<typeof this.buildTimelineModel>,
    series: ReturnType<typeof this.getConsumerTimelineSeries>,
  ) {
    if (!timeline) return svg``;

    return series.map(({ consumer, index, points }) => {
      const areas = points.map((point) => {
        const start = Math.max(point.start, timeline.start);
        const end = Math.min(point.end, timeline.now);
        if (end <= start) return svg``;

        const x1 = timeline.x(start);
        const x2 = timeline.x(end);
        const y = timeline.yHouse(point.energy_kwh);
        const baseline = timeline.plot.top + timeline.plotHeight;

        return svg`
          <rect
            x="${x1}"
            y="${y}"
            width="${Math.max(1, x2 - x1)}"
            height="${Math.max(1, baseline - y)}"
            rx="1"
            fill-opacity="0.52"
          >
            <title>
              ${consumer.name || this.getConsumerFallbackName(consumer)}
              · ${this.formatInterval(
                new Date(point.start).toISOString(),
                new Date(point.end).toISOString(),
              )}
              · ${this.formatNumber(point.energy_kwh, 3)} kWh
            </title>
          </rect>
          <line
            class="consumer-series-edge"
            x1="${x1}"
            x2="${x2}"
            y1="${y}"
            y2="${y}"
          ></line>
        `;
      });

      if (areas.length === 0) return svg``;

      return svg`
        <g
          class="consumer-series"
          style="--consumer-accent: ${this.getConsumerColor(index)}"
        >
          <title>${consumer.name || this.getConsumerFallbackName(consumer)}</title>
          ${areas}
        </g>
      `;
    });
  }

  private renderTimelineGrid(timeline: ReturnType<typeof this.buildTimelineModel>) {
    if (!timeline) return svg``;

    const yTicks = [0, 0.25, 0.5, 0.75, 1];
    const timeTicks = this.getTimelineHourTicks(timeline);
    const gridColor = "var(--divider-color)";
    const secondary = "var(--secondary-text-color)";

    return svg`
      ${yTicks.map((ratio) => {
        const y =
          timeline.plot.top +
          timeline.plotHeight -
          ratio * timeline.plotHeight;
        const value = timeline.importMax * ratio;

        return svg`
          <line
            x1="${timeline.plot.left}"
            x2="${timeline.width - timeline.plot.right}"
            y1="${y}"
            y2="${y}"
            stroke="${gridColor}"
            stroke-width="1"
            opacity="${ratio === 0 ? 0.7 : 0.35}"
          ></line>
          <text
            x="${timeline.plot.left - 8}"
            y="${y + 3}"
            text-anchor="end"
            fill="${secondary}"
            font-size="10"
          >${value.toFixed(1).replace(".", ",")}</text>
        `;
      })}

      <text
        class="timeline-axis-title"
        transform="translate(13 ${timeline.plot.top + timeline.plotHeight / 2}) rotate(-90)"
        text-anchor="middle"
        dominant-baseline="middle"
      >kr/kWh</text>

      <line
        x1="${timeline.width - timeline.plot.right}"
        x2="${timeline.width - timeline.plot.right}"
        y1="${timeline.plot.top}"
        y2="${timeline.plot.top + timeline.plotHeight}"
        stroke="${gridColor}"
        stroke-width="1"
        opacity="0.35"
      ></line>

      ${yTicks.map((ratio) => {
        const y =
          timeline.plot.top +
          timeline.plotHeight -
          ratio * timeline.plotHeight;
        const value = timeline.houseMax * ratio;

        return svg`
          <text
            x="${timeline.width - timeline.plot.right + 6}"
            y="${y + 3}"
            text-anchor="start"
            fill="${secondary}"
            font-size="10"
          >${value.toFixed(1).replace(".", ",")}</text>
        `;
      })}

      ${timeTicks.map(({ timestamp }) => {
        const x = timeline.x(timestamp);

        return svg`
          <line
            x1="${x}"
            x2="${x}"
            y1="${timeline.plot.top}"
            y2="${timeline.plot.top + timeline.plotHeight}"
            stroke="${gridColor}"
            stroke-width="1"
            opacity="0.22"
          ></line>
        `;
      })}
    `;
  }

  private renderHouseBars(timeline: ReturnType<typeof this.buildTimelineModel>) {
    if (!timeline || !this.data) return svg``;

    return this.data.house_history.map((item) => {
      const start = new Date(item.start).getTime();
      const end = new Date(item.end).getTime();

      if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        start < timeline.start ||
        !isConsumptionTimestampInTimeline(
          start,
          timeline.bounds,
          timeline.now,
        ) ||
        item.energy_kwh <= 0
      ) {
        return svg``;
      }

      const clippedStart = Math.max(start, timeline.start);
      const clippedEnd = Math.min(end, timeline.end, timeline.now);
      const x = timeline.x(clippedStart);
      const width = Math.max(
        1,
        timeline.x(clippedEnd) - timeline.x(clippedStart),
      );
      const y = timeline.yHouse(item.energy_kwh);
      const height =
        timeline.plot.top + timeline.plotHeight - y;

      return svg`
        <rect
          x="${x}"
          y="${y}"
          width="${width}"
          height="${Math.max(1, height)}"
          rx="1"
          fill="var(--energy-accent-cool)"
          opacity="0.22"
        >
          <title>
            ${this.formatInterval(item.start, item.end)}
            · ${this.formatNumber(item.energy_kwh, 3)} kWh
          </title>
        </rect>
      `;
    });
  }

  private renderHistoricalImportPrice(timeline: ReturnType<typeof this.buildTimelineModel>) {
    if (!timeline || !this.data) return svg``;

    const points = [...this.data.price_history.import_intervals]
      .map((item) => ({
        start: new Date(item.start).getTime(),
        end: new Date(item.end).getTime(),
        import: item.import,
      }))
      .filter(
        (item) =>
          Number.isFinite(item.start) &&
          Number.isFinite(item.end) &&
          Number.isFinite(item.import) &&
          isTimestampInTimeline(item.start, timeline.bounds) &&
          item.start < timeline.now,
      )
      .sort((a, b) => a.start - b.start);

    const segments: Array<typeof points> = [];
    let current: typeof points = [];

    for (const point of points) {
      const clipped = {
        ...point,
        start: Math.max(point.start, timeline.start),
        end: Math.min(point.end, timeline.now),
      };

      const previous = current[current.length - 1];
      if (
        previous &&
        clipped.start > previous.end + 60 * 1000
      ) {
        segments.push(current);
        current = [];
      }

      if (clipped.end > clipped.start) {
        current.push(clipped);
      }
    }

    if (current.length) segments.push(current);

    return svg`
      ${segments.map((segment) => {
        const path = segment
          .map((point, index) => {
            const x = timeline.x(point.start);
            const y = timeline.yImport(point.import);
            return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
          })
          .join(" ");

        return svg`
          <path
            d="${path}"
            fill="none"
            stroke="var(--energy-accent-cool)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        `;
      })}
    `;
  }

  private renderFutureImportPrice(timeline: ReturnType<typeof this.buildTimelineModel>) {
    if (!timeline) return svg``;

    const future = timeline.forecast
      .map((item) => ({
        start: Math.max(
          new Date(item.start).getTime(),
          timeline.now,
        ),
        end: new Date(item.end).getTime(),
        import: item.import,
        price_class: item.price_class,
      }))
      .filter(
        (item) =>
          Number.isFinite(item.start) &&
          Number.isFinite(item.end) &&
          Number.isFinite(item.import) &&
          item.end > item.start,
      );

    if (!future.length) return svg``;

    return svg`
      ${future.slice(0, -1).map((point, index) => {
        const next = future[index + 1];
        const x1 = timeline.x(point.start);
        const y1 = timeline.yImport(point.import);
        const x2 = timeline.x(next.start);
        const y2 = timeline.yImport(next.import);
        const path = `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;

        return svg`
          <path
            class="forecast-price-segment ${point.price_class.toLowerCase()}"
            d="${path}"
            fill="none"
            stroke-width="2.5"
            stroke-dasharray="6 5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        `;
      })}

      <text
        class="timeline-axis-title"
        transform="translate(${timeline.width - 11} ${timeline.plot.top + timeline.plotHeight / 2}) rotate(90)"
        text-anchor="middle"
        dominant-baseline="middle"
      >kWh</text>
    `;
  }

  private renderNowMarker(
    timeline: ReturnType<typeof this.buildTimelineModel>,
    priceClass: string,
  ) {
    if (!timeline) return svg``;

    const x = timeline.x(timeline.now);

    return svg`
      <line
        x1="${x}"
        x2="${x}"
        y1="${timeline.plot.top - 4}"
        y2="${timeline.plot.top + timeline.plotHeight}"
        class="timeline-now-line ${priceClass}"
        stroke-width="2"
        stroke-dasharray="3 4"
        opacity="0.85"
      ></line>
      <rect
        class="timeline-now-label ${priceClass}"
        x="${x - 18}"
        y="0"
        width="36"
        height="18"
        rx="9"
      ></rect>
      <text
        x="${x}"
        y="12"
        text-anchor="middle"
        fill="var(--primary-background-color)"
        font-size="9"
        font-weight="700"
      >NU</text>
    `;
  }

  private renderTimelineLabels(timeline: ReturnType<typeof this.buildTimelineModel>) {
    if (!timeline) return svg``;

    const ticks = this.getTimelineHourTicks(timeline);

    return svg`
      ${ticks.map(({ timestamp, desktop, narrow, mobile }) => {
        const date = new Date(timestamp);
        const x = timeline.x(timestamp);
        const textAnchor =
          x < timeline.plot.left + 18
            ? "start"
            : x > timeline.width - timeline.plot.right - 18
              ? "end"
              : "middle";

        return svg`
          <text
            class="timeline-time-label ${desktop ? "hour-label-desktop" : ""} ${narrow ? "hour-label-narrow" : ""} ${mobile ? "hour-label-mobile" : ""}"
            display="${desktop ? "inline" : "none"}"
            x="${x}"
            y="${timeline.height - 10}"
            text-anchor="${textAnchor}"
            fill="var(--secondary-text-color)"
            font-size="10"
          >${this.formatTimeLabel(date)}</text>
        `;
      })}
    `;
  }

  private formatTimeLabel(date: Date): string {
    return formatTimeLabelWithFormatter(SWEDISH_TIME_FORMATTER, date);
  }

  // ---------------------------------------------------------------------------
  // UPCOMING PRICES
  // ---------------------------------------------------------------------------

  private renderUpcomingPricesSection() {
    if (!this.data) return html``;

    const currentEnd = new Date(this.data.price.current.end).getTime();
    if (!Number.isFinite(currentEnd)) return html``;

    const upcoming = this.data.price.forecast
      .filter((item) => {
        const start = new Date(item.start).getTime();
        const end = new Date(item.end).getTime();
        return (
          Number.isFinite(start) &&
          Number.isFinite(end) &&
          start >= currentEnd &&
          end > start
        );
      })
      .sort(
        (a, b) =>
          new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

    if (upcoming.length === 0) return html``;

    let hourMarkerIndex = 0;

    return html`
      <section class="upcoming-section">
        <div class="section-title">KOMMANDE PRISER (15 MINUTER)</div>

        <div class="upcoming-scroll">
          <div class="upcoming-track">
            <div class="upcoming-time-axis" aria-hidden="true">
              ${upcoming.map((item) => {
                const start = new Date(item.start);
                const isHour =
                  start.getMinutes() === 0 &&
                  start.getSeconds() === 0 &&
                  start.getMilliseconds() === 0;
                const markerIndex = isHour ? hourMarkerIndex++ : -1;

                return html`
                  <span class="upcoming-time-cell ${isHour ? "upcoming-hour-marker" : ""}">
                    ${isHour
                      ? html`
                          <span class="upcoming-hour-label ${markerIndex % 2 === 0 ? "hour-label-narrow" : ""} ${markerIndex % 3 === 0 ? "hour-label-mobile" : ""}">
                            ${this.formatTimeLabel(start)}
                          </span>
                        `
                      : ""}
                  </span>
                `;
              })}
            </div>

            <div class="upcoming-list" aria-label="Kommande importpriser">
              ${upcoming.map((item) => {
                const details = `${this.formatInterval(item.start, item.end)} · ${this.formatPrice(item.import)} kr/kWh import · ${this.getPriceClassShortLabel(item.price_class)}`;

                return html`
                  <div
                    class="upcoming-price ${item.price_class.toLowerCase()}"
                    role="img"
                    aria-label="${details}"
                    title="${details}"
                  ></div>
                `;
              })}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ---------------------------------------------------------------------------
  // KPI SECTION
  // ---------------------------------------------------------------------------

  private renderKpiSection() {
    if (!this.data) return html``;

    const house = this.data.house;
    const cheapest =
      this.data.price_intelligence.cheapest_future_period;

    return html`
      <div class="overview-kpis" aria-label="Nyckeltal – senaste 24 timmarna">
        <div class="overview-kpi">
          <div class="kpi-label">Importkostnad</div>
          <div class="kpi-value">
            ${this.formatNumber(house.cost, 2)}
            <span>kr</span>
          </div>
          <div class="kpi-meta">Total importkostnad</div>
        </div>

        <div class="overview-kpi">
          <div class="kpi-label">Förbrukning</div>
          <div class="kpi-value">
            ${this.formatNumber(house.consumption_kwh, 2)}
            <span>kWh</span>
          </div>
          <div class="kpi-meta">Husets totala förbrukning</div>
        </div>

        <div class="overview-kpi">
          <div class="kpi-label">Under medianpris</div>
          <div class="kpi-value">
            ${this.formatNumber(house.cheap_usage_percent, 1)}
            <span>%</span>
          </div>
          <div class="kpi-meta">Av energiförbrukningen</div>
        </div>

        <div class="overview-kpi">
          <div class="kpi-label">Nästa billiga period</div>
          <div class="kpi-value kpi-time">
            ${cheapest
              ? this.formatInterval(
                  cheapest.start,
                  cheapest.end,
                )
              : "—"}
          </div>
          <div class="kpi-meta">
            ${cheapest
              ? `${this.formatPrice(
                  cheapest.average_import_price,
                )} kr/kWh import`
              : "Ingen period tillgänglig"}
          </div>
        </div>
      </div>
    `;
  }

  private setView(view: DashboardView): void {
    this.view = view;
  }

  // ---------------------------------------------------------------------------
  // CONSUMERS
  // ---------------------------------------------------------------------------

  private renderSmartScoreSection() {
    if (!this.data) return html``;

    const house = this.data.house;
    const score = house.smart_score;

    return html`
      <section class="smart-score-section">
        <div class="smart-score-card">
          <div class="smart-score-main">
            <div class="section-title">SMART SCORE</div>
            <div class="smart-score-value">
              ${score !== null && Number.isFinite(score)
                ? this.formatNumber(score, 0)
                : "—"}
              <span>/ 100</span>
            </div>
          </div>
          <div class="smart-score-metrics">
            <div class="smart-score-metric">
              <div class="smart-score-label">Över medianpris</div>
              <div class="smart-score-metric-value">
                ${this.formatNumber(house.expensive_usage_percent, 1)}<span>%</span>
              </div>
            </div>
            <div class="smart-score-metric">
              <div class="smart-score-label">Batteribidrag</div>
              <div class="smart-score-metric-value">
                ${this.formatNumber(house.battery_contribution_percent ?? undefined, 1)}<span>%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private getConsumerColor(index: number): string {
    const palette = [
      "#00cfff",
      "#b46cff",
      "#ff4fb8",
      "#6f7cff",
      "#25d9c8",
      "#d276ff",
      "#45a5ff",
    ];

    return palette[index % palette.length];
  }

  private renderConsumersSection() {
    if (!this.data) return html``;

    const consumers = Object.values(this.data.consumers);

    return html`
      <section class="consumers-section">
        <div class="section-title">FÖRBRUKNING PER ENHET</div>

        <div class="consumer-list-header" aria-hidden="true">
          <div>Enhet</div>
          <div>Förbrukning</div>
          <div class="consumer-average-price-column">Snittpris</div>
          <div>Kostnad</div>
        </div>

        <div class="consumer-list">
          ${consumers.map((consumer, index) =>
            this.renderConsumer(consumer, index),
          )}
        </div>
      </section>
    `;
  }

  private renderConsumer(consumer: DashboardConsumer, index: number) {
    const analysis = consumer.analysis;
    const hasConsumption = analysis.energy_kwh > 0;

    const name =
      consumer.name || this.getConsumerFallbackName(consumer);

    return html`
      <div
        class="consumer"
        style="--consumer-accent: ${this.getConsumerColor(index)}"
      >
        <div class="consumer-name">${name}</div>

        <div class="consumer-metric-value">
          ${hasConsumption
            ? html`
                ${this.formatNumber(analysis.energy_kwh, 2)}
                <span>kWh</span>
              `
            : html`
                <span class="muted-value">Ingen förbrukning</span>
              `}
        </div>

        <div class="consumer-metric-value consumer-average-price-column">
          ${analysis.average_import_price !== null
            ? html`
                ${this.formatPrice(analysis.average_import_price)}
                <span>kr/kWh</span>
              `
            : html`<span class="muted-value">—</span>`}
          </div>

        <div class="consumer-metric-value consumer-cost">
          ${this.formatNumber(analysis.cost, 2)}
          <span>kr</span>
        </div>

        <div class="consumer-details">
          <span>
            ${this.formatNumber(analysis.share_percent, 1)}% av husförbrukningen
          </span>
          <span class="consumer-detail-separator">·</span>
          ${analysis.price_alignment_delta === null
            ? html`<span class="muted-value">Prisjämförelse saknas</span>`
            : analysis.price_alignment_delta > 0
              ? html`
                  <span class="consumer-price-cheaper">
                    ${this.formatNumber(
                      analysis.price_alignment_delta,
                      2,
                    )} kr/kWh billigare än huset
                  </span>
              `
              : analysis.price_alignment_delta < 0
                ? html`
                    <span class="consumer-price-costlier">
                      ${this.formatNumber(
                        Math.abs(analysis.price_alignment_delta),
                        2,
                      )} kr/kWh dyrare än huset
                    </span>
                  `
                : html`<span class="consumer-price-equal">Samma snittpris som huset</span>`}
          <span class="consumer-detail-separator consumer-mobile-average-separator">·</span>
          <span class="consumer-mobile-average-price">
            Snittpris
            ${analysis.average_import_price !== null
              ? html`${this.formatPrice(analysis.average_import_price)} kr/kWh`
              : html`—`}
          </span>
        </div>
      </div>
    `;
  }

  private getConsumerFallbackName(
    consumer: DashboardConsumer,
  ): string {
    const entity = consumer.energy_entity;

    if (entity.includes("charger")) {
      return "Elbil / Laddare";
    }

    if (entity.includes("thermia")) {
      return "Värmepump";
    }

    return entity;
  }

  // ---------------------------------------------------------------------------
  // INSIGHTS
  // ---------------------------------------------------------------------------

  private renderInsightsSection() {
    if (!this.data) {
      return html``;
    }

    const insights = this.data.insights.filter(
      (insight) =>
        insight.type !== "consumer_cost" &&
        insight.type !== "consumer_share" &&
        insight.type !== "consumer_price_alignment",
    );

    if (insights.length === 0) return html``;

    return html`
      <section class="insights-section">
        <div class="section-title">INSIGHTS – SENASTE 24H</div>

        <div class="insights-list">
          ${insights.map((insight) =>
            this.renderInsight(insight),
          )}
        </div>
      </section>
    `;
  }

  private renderInsight(insight: DashboardInsight) {
    switch (insight.type) {
      case "cheap_consumption":
        return html`
          <div class="insight insight-positive">
            <div class="insight-icon">↓</div>

            <div class="insight-content">
              <div class="insight-title">
                Förbrukning under billiga priser
              </div>

              <div class="insight-text">
                ${this.formatNumber(
                  insight.cheap_usage_percent,
                  1,
                )}% av energin användes under medianpriset.
              </div>
            </div>
          </div>
        `;

      case "expensive_consumption":
        return html`
          <div class="insight insight-warning">
            <div class="insight-icon">↑</div>

            <div class="insight-content">
              <div class="insight-title">
                Förbrukning under dyra priser
              </div>

              <div class="insight-text">
                ${this.formatNumber(
                  insight.expensive_usage_percent,
                  1,
                )}% av energin användes under dyrare priser.
              </div>
            </div>
          </div>
        `;

      case "highest_cost_period":
        return html`
          <div class="insight insight-danger">
            <div class="insight-icon">!</div>

            <div class="insight-content">
              <div class="insight-title">
                Dyraste förbrukningsperioden
              </div>

              <div class="insight-text">
                ${this.formatInterval(
                  insight.start,
                  insight.end,
                )}
              </div>

              <div class="insight-meta">
                ${this.formatNumber(insight.energy_kwh, 3)} kWh ·
                ${this.formatNumber(insight.cost, 2)} kr · Importpris
                ${this.formatPrice(insight.import_price)}
                kr/kWh
              </div>
            </div>
          </div>
        `;

      case "lowest_cost_period":
        return html`
          <div class="insight insight-positive">
            <div class="insight-icon">↓</div>

            <div class="insight-content">
              <div class="insight-title">
                Billigaste förbrukningsperioden
              </div>

              <div class="insight-text">
                ${this.formatInterval(
                  insight.start,
                  insight.end,
                )}
              </div>

              <div class="insight-meta">
                ${this.formatNumber(insight.energy_kwh, 3)} kWh ·
                ${this.formatNumber(insight.cost, 2)} kr · Importpris
                ${this.formatPrice(insight.import_price)}
                kr/kWh
              </div>
            </div>
          </div>
        `;

      case "consumer_cost":
        return html`
          <div class="insight insight-neutral">
            <div class="insight-icon">•</div>

            <div class="insight-content">
              <div class="insight-title">
                ${insight.name}
              </div>

              <div class="insight-text">
                ${this.formatNumber(insight.energy_kwh, 2)}
                kWh kostade
                ${this.formatNumber(insight.cost, 2)}
                kr.
              </div>

              <div class="insight-meta">
                ${insight.average_import_price !== null
                  ? html`
                      Genomsnittligt importpris
                      ${this.formatPrice(
                        insight.average_import_price,
                      )}
                      kr/kWh
                    `
                  : html`
                      Ingen förbrukning registrerad.
                    `}
              </div>
            </div>
          </div>
        `;

      case "consumer_share":
        return html`
          <div class="insight insight-neutral">
            <div class="insight-icon">•</div>

            <div class="insight-content">
              <div class="insight-title">
                ${insight.name}
              </div>

              <div class="insight-text">
                ${this.formatNumber(insight.share_percent, 1)}%
                av hushållets förbrukning.
              </div>
            </div>
          </div>
        `;

      case "consumer_price_alignment":
        return html`
          <div class="insight insight-neutral">
            <div class="insight-icon">•</div>

            <div class="insight-content">
              <div class="insight-title">
                ${insight.name} – prisjämförelse
              </div>

              <div class="insight-text">
                ${insight.price_alignment_delta > 0
                  ? html`
                      ${this.formatNumber(
                        insight.price_alignment_delta,
                        2,
                      )} kr/kWh billigare än huset.
                    `
                  : insight.price_alignment_delta < 0
                    ? html`
                        ${this.formatNumber(
                          Math.abs(insight.price_alignment_delta),
                          2,
                        )} kr/kWh dyrare än huset.
                      `
                    : html`
                        Samma snittpris som huset.
                      `}
              </div>
            </div>
          </div>
        `;
    }
  }

  // ---------------------------------------------------------------------------
  // FORMATTERS
  // ---------------------------------------------------------------------------

  private getPriceClassShortLabel(priceClass: string): string {
    switch (priceClass) {
      case "VERY_CHEAP":
        return "Mycket billigt";
      case "CHEAP":
        return "Billigt";
      case "NORMAL":
        return "Normalt";
      case "EXPENSIVE":
        return "Dyrt";
      case "VERY_EXPENSIVE":
        return "Mycket dyrt";
      default:
        return priceClass;
    }
  }

  private getPriceClassLabel(priceClass: string): string {
    switch (priceClass) {
      case "VERY_CHEAP":
        return "Mycket billigt";

      case "CHEAP":
        return "Billigt";

      case "NORMAL":
        return "Normalt";

      case "EXPENSIVE":
        return "Dyrt";

      case "VERY_EXPENSIVE":
        return "Mycket dyrt";

      default:
        return priceClass;
    }
  }

  private formatPrice(value: number | undefined): string {
    if (value === undefined || !Number.isFinite(value)) {
      return "—";
    }

    return value.toFixed(2).replace(".", ",");
  }

  private formatNumber(
    value: number | undefined,
    decimals = 1,
  ): string {
    if (value === undefined || !Number.isFinite(value)) {
      return "—";
    }

    return value.toFixed(decimals).replace(".", ",");
  }

  private formatInterval(start: string, end: string): string {
    return formatIntervalWithFormatter(
      SWEDISH_TIME_FORMATTER,
      start,
      end,
    );
  }

  // ---------------------------------------------------------------------------
  // STYLES
  // ---------------------------------------------------------------------------

  static styles = css`
    :host {
      display: block;
      --energy-background: #0b1420;
      --energy-surface: #111e2c;
      --energy-panel: rgba(20, 35, 51, 0.78);
      --energy-border: rgba(145, 176, 203, 0.18);
      --energy-text: #eaf2fa;
      --energy-muted: #9eb1c3;
      --energy-price-cheap: #50dc84;
      --energy-price-normal: #f0cd58;
      --energy-price-expensive: #ff9b4e;
      --energy-price-very-expensive: #ff6f78;
      --energy-accent-cool: #50d8f2;
    }

    ha-card {
      background:
        radial-gradient(circle at 100% 0%, rgba(67, 196, 229, 0.08), transparent 38%),
        linear-gradient(145deg, var(--energy-background), var(--energy-surface));
      border: 1px solid var(--energy-border);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
      color: var(--energy-text);
      overflow: hidden;
      --primary-text-color: var(--energy-text);
      --secondary-text-color: var(--energy-muted);
      --divider-color: var(--energy-border);
      --primary-background-color: var(--energy-background);
      --card-background-color: var(--energy-panel);
      --ha-card-background: var(--energy-background);
      --primary-color: var(--energy-accent-cool);
      --info-color: var(--energy-accent-cool);
      --success-color: var(--energy-price-cheap);
      --warning-color: var(--energy-price-expensive);
      --error-color: var(--energy-price-very-expensive);
    }

    .dashboard-layout {
      container-name: dashboard-card;
      container-type: inline-size;
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      min-width: 0;
      width: 100%;
    }

    .dashboard-overview,
    .dashboard-timeline-prices,
    .dashboard-smart-score,
    .dashboard-lower-grid {
      grid-column: 1 / -1;
      min-width: 0;
    }

    .dashboard-timeline,
    .dashboard-upcoming {
      min-width: 0;
    }

    .dashboard-timeline-prices {
      background: var(--energy-panel);
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      grid-column: 1 / -1;
      min-width: 0;
      overflow: hidden;
    }

    .dashboard-lower-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      min-width: 0;
    }

    .dashboard-consumers,
    .dashboard-insights {
      background: var(--energy-panel);
      border: 1px solid var(--energy-border);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .dashboard-consumers > .consumers-section,
    .dashboard-insights > .insights-section {
      box-sizing: border-box;
      flex: 1;
    }

    .dashboard-upcoming > .upcoming-section,
    .upcoming-list {
      box-sizing: border-box;
      max-width: 100%;
      min-width: 0;
      width: 100%;
    }

    .price-header {
      background: var(--energy-panel);
      border: 1px solid var(--energy-border);
      border-radius: 12px;
      padding: 14px;
    }

    .overview-layout {
      display: grid;
      grid-template-columns: minmax(240px, 0.42fr) minmax(0, 1fr);
      gap: 14px;
      min-width: 0;
    }

    .overview-support {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: space-evenly;
      min-width: 0;
      padding: 4px 8px;
    }

    .price-quality-summary {
      align-items: baseline;
      border-bottom: 1px solid var(--energy-border);
      display: flex;
      gap: 12px;
      justify-content: space-between;
      min-width: 0;
      padding: 2px 2px 10px;
    }

    .pqi-label {
      color: var(--energy-muted);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      min-width: 0;
      text-transform: uppercase;
    }

    .pqi-value {
      color: var(--energy-accent-cool);
      font-size: 25px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }

    .pqi-value span {
      font-size: 14px;
      font-weight: 600;
    }

    .current-price-card {
      --current-price-accent: var(--energy-price-normal);
      align-items: flex-start;
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--energy-panel) 92%, var(--current-price-accent)),
        var(--energy-surface) 78%
      );
      border: 1px solid color-mix(in srgb, var(--current-price-accent) 30%, var(--divider-color));
      border-radius: 12px;
      box-shadow: 0 0 18px color-mix(in srgb, var(--current-price-accent) 7%, transparent);
      display: flex;
      flex-direction: column;
      min-width: 0;
      padding: 14px;
    }

    .current-price-card.very_cheap,
    .current-price-card.cheap {
      --current-price-accent: var(--energy-price-cheap);
    }

    .current-price-card.expensive {
      --current-price-accent: var(--energy-price-expensive);
    }

    .current-price-card.very_expensive {
      --current-price-accent: var(--energy-price-very-expensive);
    }

    .price-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      min-width: 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--energy-border);
    }

    .price-stats .stat {
      background: transparent;
      border: 0;
      border-radius: 0;
      min-width: 0;
      padding: 4px 10px;
    }

    .price-stats .stat + .stat {
      border-left: 1px solid var(--energy-border);
    }

    .price-stats .stat:first-child {
      padding-left: 2px;
    }

    .price-stats .stat:last-child {
      padding-right: 2px;
    }

    .price-stats .stat-label {
      margin-bottom: 4px;
    }

    .eyebrow,
    .section-title {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .eyebrow {
      margin-bottom: 6px;
    }

    .current-price {
      font-size: 38px;
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.03em;
    }

    .current-price-row {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px 12px;
      min-width: 0;
      max-width: 100%;
    }

    .price-gauge {
      align-self: center;
      display: grid;
      height: 164px;
      max-width: 100%;
      place-items: center;
      position: relative;
      width: 164px;
    }

    .price-gauge-ring {
      background: conic-gradient(
        from 135deg,
        var(--energy-price-cheap) 0deg,
        var(--energy-price-normal) 90deg,
        var(--energy-price-expensive) 180deg,
        var(--energy-price-very-expensive) 270deg,
        transparent 270deg 360deg
      );
      border-radius: 50%;
      filter: drop-shadow(0 2px 7px color-mix(in srgb, var(--current-price-accent) 24%, transparent));
      inset: 0;
      mask: radial-gradient(farthest-side, transparent calc(100% - 11px), #000 calc(100% - 9px));
      position: absolute;
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 11px), #000 calc(100% - 9px));
    }

    .price-gauge-marker {
      inset: 0;
      pointer-events: none;
      position: absolute;
      transform: rotate(var(--pqi-angle));
    }

    .price-gauge-marker::after {
      background: var(--current-price-accent);
      border: 2px solid var(--ha-card-background, var(--primary-background-color));
      border-radius: 50%;
      box-shadow: 0 0 8px color-mix(in srgb, var(--current-price-accent) 50%, transparent);
      content: "";
      height: 10px;
      left: 50%;
      position: absolute;
      top: 5px;
      transform: translateX(-50%);
      width: 10px;
    }

    .price-gauge-center {
      align-items: center;
      display: flex;
      inset: 18px;
      justify-content: center;
      position: absolute;
      text-align: center;
    }

    .price-gauge-center .current-price-row {
      align-items: center;
      flex-direction: column;
      gap: 4px;
      justify-content: center;
    }

    .price-gauge-center .current-price {
      font-size: 27px;
    }

    .price-gauge-center .current-price .unit {
      font-size: 11px;
      margin-left: 1px;
    }

    .price-gauge-center .price-status {
      align-self: center;
      background: color-mix(in srgb, var(--current-price-accent) 8%, transparent);
      border-color: color-mix(in srgb, var(--current-price-accent) 38%, var(--divider-color));
      min-width: 120px;
      padding: 6px 8px;
      text-align: center;
    }

    .price-gauge-center .status-label {
      font-size: 12px;
    }

    .current-price .unit {
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      letter-spacing: normal;
      margin-left: 4px;
    }

    .current-time {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-top: 7px;
    }

    .current-price-card .current-time {
      align-self: center;
      text-align: center;
    }

    .price-status {
      min-width: 120px;
      max-width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid color-mix(in srgb, var(--current-price-accent) 38%, var(--divider-color));
      border-radius: 12px;
      text-align: right;
      align-self: flex-start;
      margin-top: 14px;
      background: color-mix(in srgb, var(--current-price-accent) 8%, transparent);
    }

    .current-price-row .price-status {
      flex: 0 1 auto;
      margin-top: 0;
    }

    .status-label {
      font-size: 14px;
      font-weight: 700;
    }

    .very_cheap .status-label,
    .cheap .status-label {
      color: var(--energy-price-cheap);
    }

    .normal .status-label {
      color: var(--energy-price-normal);
    }

    .expensive .status-label {
      color: var(--energy-price-expensive);
    }

    .very_expensive .status-label {
      color: var(--energy-price-very-expensive);
    }

    .stat {
      background: var(--energy-panel);
      box-sizing: border-box;
      min-width: 0;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .stat-label {
      color: var(--secondary-text-color);
      font-size: 11px;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 17px;
      font-weight: 600;
    }

    /* TIMELINE */

    .timeline-section {
      padding: 18px 20px 10px;
    }

    .timeline-heading {
      align-items: flex-end;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 12px;
    }

    .timeline-subtitle {
      color: var(--secondary-text-color);
      font-size: 11px;
      margin-top: -8px;
    }

    .timeline-legend {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: flex-end;
    }

    .timeline-view-selector {
      border: 1px solid var(--energy-border);
      border-radius: 8px;
      display: flex;
      flex: 0 0 auto;
      gap: 2px;
      padding: 2px;
    }

    .timeline-view-selector button {
      background: transparent;
      border: 0;
      border-radius: 6px;
      color: var(--energy-muted);
      cursor: pointer;
      font: inherit;
      font-size: 10px;
      font-weight: 600;
      padding: 5px 8px;
      white-space: nowrap;
    }

    .timeline-view-selector button.selected {
      background: color-mix(in srgb, var(--energy-accent-cool) 18%, transparent);
      color: var(--energy-text);
    }

    .legend-item {
      align-items: center;
      color: var(--secondary-text-color);
      display: inline-flex;
      font-size: 10px;
      gap: 5px;
      white-space: nowrap;
    }

    .legend-line {
      display: inline-block;
      height: 0;
      width: 20px;
    }

    .legend-line.history {
      border-top: 2px solid var(--energy-accent-cool);
    }

    .legend-line.future {
      border-top: 2px dashed var(--energy-muted);
    }

    .forecast-price-segment {
      stroke: var(--energy-price-normal);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2.5px;
    }

    .forecast-price-segment.very_cheap,
    .forecast-price-segment.cheap {
      stroke: var(--energy-price-cheap);
    }

    .forecast-price-segment.normal {
      stroke: var(--energy-price-normal);
    }

    .forecast-price-segment.expensive {
      stroke: var(--energy-price-expensive);
    }

    .forecast-price-segment.very_expensive {
      stroke: var(--energy-price-very-expensive);
    }

    .legend-bar {
      background: var(--energy-accent-cool);
      border-radius: 1px;
      display: inline-block;
      height: 8px;
      opacity: 0.3;
      width: 14px;
    }

    .legend-consumer {
      background: var(--consumer-accent);
      border-radius: 50%;
      display: inline-block;
      flex: 0 0 8px;
      height: 8px;
      width: 8px;
    }

    .consumer-series {
      fill: var(--consumer-accent);
    }

    .consumer-series-edge {
      stroke: var(--consumer-accent);
      stroke-opacity: 0.96;
      stroke-width: 1.25;
    }

    .timeline-time-label.hour-label-desktop {
      display: inline;
    }

    .timeline-chart {
      background: linear-gradient(
        to top,
        color-mix(in srgb, var(--energy-price-cheap) 6%, transparent),
        color-mix(in srgb, var(--energy-price-normal) 4%, transparent) 52%,
        color-mix(in srgb, var(--energy-price-expensive) 6%, transparent)
      );
      overflow: hidden;
      padding: 0;
    }

    .timeline-axis-title {
      fill: var(--secondary-text-color);
      font-size: 10px;
    }

    .timeline-now-line,
    .timeline-now-label {
      --timeline-now-accent: var(--energy-price-normal);
    }

    .timeline-now-line.very_cheap,
    .timeline-now-line.cheap,
    .timeline-now-label.very_cheap,
    .timeline-now-label.cheap {
      --timeline-now-accent: var(--energy-price-cheap);
    }

    .timeline-now-line.expensive,
    .timeline-now-label.expensive {
      --timeline-now-accent: var(--energy-price-expensive);
    }

    .timeline-now-line.very_expensive,
    .timeline-now-label.very_expensive {
      --timeline-now-accent: var(--energy-price-very-expensive);
    }

    .timeline-now-line {
      filter: drop-shadow(0 0 3px color-mix(in srgb, var(--timeline-now-accent) 48%, transparent));
      stroke: var(--timeline-now-accent);
    }

    .timeline-now-label {
      fill: var(--timeline-now-accent);
      filter: drop-shadow(0 0 4px color-mix(in srgb, var(--timeline-now-accent) 42%, transparent));
    }

    .timeline-chart svg {
      display: block;
      height: clamp(150px, 20cqw, 220px);
      min-height: 0;
      width: 100%;
    }

    .timeline-empty {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      color: var(--secondary-text-color);
      font-size: 12px;
      padding: 24px;
      text-align: center;
    }

    /* UPCOMING PRICES */

    .upcoming-section {
      border-top: 1px solid var(--divider-color);
      padding: 12px 20px 16px;
    }

    .upcoming-list {
      display: grid;
      grid-auto-columns: 10px;
      grid-auto-flow: column;
      grid-template-columns: none;
      gap: 2px;
      padding: 2px 1px 8px;
      width: max-content;
    }

    .upcoming-scroll {
      max-width: 100%;
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;
    }

    .upcoming-track {
      min-width: 100%;
      width: max-content;
    }

    .upcoming-time-axis {
      box-sizing: border-box;
      display: grid;
      grid-auto-columns: 10px;
      grid-auto-flow: column;
      grid-template-columns: none;
      gap: 2px;
      height: 18px;
      padding-left: 1px;
      width: max-content;
    }

    .upcoming-time-cell {
      box-sizing: border-box;
      min-width: 0;
      position: relative;
      width: 10px;
    }

    .upcoming-hour-marker {
      border-left: 1px solid var(--energy-border);
    }

    .upcoming-hour-label {
      bottom: 2px;
      color: var(--energy-muted);
      font-size: 9px;
      left: 3px;
      position: absolute;
      white-space: nowrap;
    }

    .upcoming-price {
      box-sizing: border-box;
      border: 1px solid color-mix(in srgb, var(--energy-border) 70%, transparent);
      border-radius: 2px;
      height: 26px;
      min-width: 10px;
      width: 10px;
    }

    .upcoming-price.very_cheap {
      background: color-mix(in srgb, var(--energy-price-cheap) 76%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-cheap) 82%, var(--energy-border));
    }

    .upcoming-price.cheap {
      background: color-mix(in srgb, var(--energy-price-cheap) 62%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-cheap) 70%, var(--energy-border));
    }

    .upcoming-price.normal {
      background: color-mix(in srgb, var(--energy-price-normal) 58%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-normal) 68%, var(--energy-border));
    }

    .upcoming-price.expensive {
      background: color-mix(in srgb, var(--energy-price-expensive) 66%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-expensive) 74%, var(--energy-border));
    }

    .upcoming-price.very_expensive {
      background: color-mix(in srgb, var(--energy-price-very-expensive) 74%, var(--energy-panel));
      border-color: color-mix(in srgb, var(--energy-price-very-expensive) 82%, var(--energy-border));
    }

    /* OVERVIEW KPIS */

    .section-title {
      margin-bottom: 14px;
    }

    .overview-kpis {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      min-width: 0;
    }

    .overview-kpi {
      min-width: 0;
      padding: 6px 10px 8px;
    }

    .overview-kpi:nth-child(even) {
      border-left: 1px solid var(--energy-border);
    }

    .overview-kpi:nth-child(n + 3) {
      border-top: 1px solid var(--energy-border);
      padding-top: 9px;
    }

    .overview-kpi:nth-child(odd) {
      padding-left: 2px;
    }

    .overview-kpi:nth-child(even) {
      padding-right: 2px;
    }

    .kpi-label {
      color: var(--energy-muted);
      font-size: 11px;
      line-height: 1.3;
      margin-bottom: 4px;
    }

    .kpi-value {
      font-size: 20px;
      font-weight: 650;
      line-height: 1.15;
      min-width: 0;
      overflow-wrap: anywhere;
      white-space: normal;
    }

    .kpi-value span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    .kpi-time {
      font-size: 17px;
    }

    .kpi-meta {
      color: var(--secondary-text-color);
      font-size: 9px;
      line-height: 1.35;
      margin-top: 3px;
    }

    /* SMART SCORE */

    .smart-score-section {
      border-top: 1px solid var(--divider-color);
      padding: 10px 22px;
    }

    .smart-score-card {
      background: var(--energy-panel);
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
      align-items: center;
      gap: 16px;
      padding: 10px 14px;
      border: 1px solid color-mix(in srgb, var(--energy-accent-cool) 28%, var(--divider-color));
      border-radius: 12px;
      box-shadow: 0 0 16px color-mix(in srgb, var(--energy-accent-cool) 7%, transparent);
    }

    .smart-score-main {
      align-items: baseline;
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
      min-width: 0;
    }

    .smart-score-value {
      color: var(--energy-accent-cool);
      font-size: 32px;
      font-weight: 700;
      line-height: 1.1;
    }

    .smart-score-value span,
    .smart-score-metric-value span {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
    }

    .smart-score-label {
      color: var(--secondary-text-color);
      font-size: 11px;
      margin-bottom: 6px;
    }

    .smart-score-metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      align-items: center;
      min-width: 0;
    }

    .smart-score-metric-value {
      font-size: 17px;
      font-weight: 650;
      white-space: nowrap;
    }

    /* CONSUMERS */

    .consumers-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
    }

    .consumer-list {
      display: grid;
      min-width: 0;
      max-height: 240px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .consumer-list-header,
    .consumer {
      align-items: center;
      column-gap: 10px;
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 0.9fr);
      min-width: 0;
    }

    .consumer-list-header {
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 600;
      padding: 0 0 8px;
    }

    .consumer {
      border-top: 1px solid color-mix(in srgb, var(--energy-accent-cool) 14%, var(--divider-color));
      padding: 10px 0;
    }

    .consumer:hover {
      background: color-mix(in srgb, var(--energy-accent-cool) 4%, transparent);
    }

    .consumer-details {
      align-items: baseline;
      color: var(--secondary-text-color);
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      gap: 2px 5px;
      grid-column: 1 / -1;
      min-width: 0;
      overflow-wrap: anywhere;
      padding-top: 2px;
    }

    .consumer-detail-separator {
      color: var(--secondary-text-color);
    }

    .consumer-price-cheaper {
      color: var(--energy-price-cheap);
    }

    .consumer-price-costlier {
      color: var(--energy-price-very-expensive);
    }

    .consumer-price-equal {
      color: var(--energy-muted);
    }

    .consumer-mobile-average-price,
    .consumer-mobile-average-separator {
      display: none;
    }

    .consumer-name {
      align-items: flex-start;
      display: flex;
      font-size: 13px;
      font-weight: 600;
      gap: 7px;
      min-width: 0;
    }

    .consumer-name::before {
      background: var(--consumer-accent);
      border-radius: 50%;
      content: "";
      flex: 0 0 8px;
      height: 8px;
      margin-top: 4px;
      width: 8px;
    }

    .consumer-metric-value {
      font-size: 13px;
      font-weight: 550;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .consumer-metric-value span {
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 500;
    }

    .muted-value {
      color: var(--secondary-text-color) !important;
      font-size: 12px !important;
      font-weight: 500 !important;
    }

    /* INSIGHTS */

    .insights-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
    }

    .insights-list {
      display: grid;
      min-width: 0;
    }

    .insight {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      border-top: 1px solid var(--divider-color);
      min-width: 0;
      padding: 12px 0;
    }

    .insight:hover {
      background: color-mix(in srgb, var(--energy-accent-cool) 4%, transparent);
    }

    .insight:first-child {
      border-top: 0;
      padding-top: 0;
    }

    .insight-icon {
      align-items: center;
      border-radius: 50%;
      display: flex;
      flex: 0 0 30px;
      font-size: 15px;
      font-weight: 700;
      height: 30px;
      justify-content: center;
      width: 30px;
    }

    .insight-positive .insight-icon {
      background: var(--energy-price-cheap);
      color: var(--primary-background-color);
    }

    .insight-warning .insight-icon {
      background: var(--energy-price-expensive);
      color: var(--primary-background-color);
    }

    .insight-danger .insight-icon {
      background: var(--energy-price-very-expensive);
      color: var(--primary-background-color);
    }

    .insight-neutral .insight-icon {
      background: var(--secondary-text-color);
      color: var(--primary-background-color);
    }

    .insight-content {
      min-width: 0;
    }

    .insight-title {
      font-size: 14px;
      font-weight: 650;
      overflow-wrap: anywhere;
    }

    .insight-text {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.45;
      margin-top: 3px;
      overflow-wrap: anywhere;
    }

    .insight-meta {
      color: var(--secondary-text-color);
      font-size: 10px;
      margin-top: 4px;
      overflow-wrap: anywhere;
    }

    .loading {
      color: var(--secondary-text-color);
      padding: 20px;
    }

    .content {
      padding: 20px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
    }

    .error {
      color: var(--error-color);
      margin-top: 10px;
      white-space: pre-wrap;
    }

    @container dashboard-card (max-width: 980px) {
      .timeline-section {
        padding: 16px 16px 8px;
      }

      .upcoming-section {
        padding: 10px 16px 14px;
      }
    }

    @container dashboard-card (max-width: 780px) {
      .overview-layout {
        grid-template-columns: minmax(0, 1fr);
      }

      .overview-support {
        padding: 4px 2px;
      }
    }

    @container dashboard-card (max-width: 480px) {
      .price-stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 4px;
      }

      .price-stats .stat {
        padding-left: 6px;
        padding-right: 6px;
      }

      .price-stats .stat:first-child {
        padding-left: 0;
      }

      .price-stats .stat:last-child {
        padding-right: 0;
      }

      .price-stats .stat-value {
        font-size: 14px;
      }

      .kpi-value {
        font-size: 18px;
      }
    }

    @container dashboard-card (max-width: 860px) {
      .dashboard-lower-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .dashboard-consumers,
      .dashboard-insights {
        display: block;
      }

      .consumer-list {
        max-height: none;
        overflow-y: visible;
      }
    }

    @container dashboard-card (max-width: 700px) {
      .timeline-heading {
        align-items: flex-start;
        flex-direction: column;
        gap: 8px;
      }

      .timeline-legend {
        justify-content: flex-start;
      }

      .timeline-chart svg text {
        font-size: 15px;
      }

      .timeline-time-label.hour-label-desktop {
        display: none;
      }

      .timeline-time-label.hour-label-narrow {
        display: inline;
      }

      .upcoming-hour-label:not(.hour-label-narrow) {
        display: none;
      }

      .timeline-legend {
        gap: 8px;
      }
    }

    @container dashboard-card (max-width: 700px) {
      .smart-score-card {
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
      }
    }

    @container dashboard-card (max-width: 360px) {
      .overview-kpis {
        grid-template-columns: minmax(0, 1fr);
      }

      .overview-kpi,
      .overview-kpi:nth-child(even),
      .overview-kpi:nth-child(n + 3) {
        border-left: 0;
        border-top: 1px solid var(--energy-border);
        padding: 8px 0;
      }

      .overview-kpi:first-child {
        border-top: 0;
      }
    }

    @container dashboard-card (max-width: 520px) {
      .consumer-list-header,
      .consumer {
        grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 0.9fr);
      }

      .consumer-average-price-column {
        display: none;
      }

      .consumer-mobile-average-price,
      .consumer-mobile-average-separator {
        display: inline;
      }
    }

    @container dashboard-card (max-width: 420px) {
      .timeline-time-label.hour-label-narrow {
        display: none;
      }

      .timeline-time-label.hour-label-mobile {
        display: inline;
      }

      .upcoming-hour-label:not(.hour-label-mobile) {
        display: none;
      }

      .price-gauge {
        height: 148px;
        width: 148px;
      }

      .price-gauge-center {
        inset: 13px;
      }

      .price-gauge-center .current-price {
        font-size: 24px;
      }

      .price-gauge-center .price-status {
        min-width: 108px;
      }

      .smart-score-metrics {
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
      }
    }

    @media (max-width: 500px) {
      .price-header {
        padding: 18px;
      }

      .current-price {
        font-size: 32px;
      }

      .price-status {
        min-width: 100px;
        padding: 8px 10px;
      }

      .price-stats {
        gap: 8px;
      }

      .stat-value {
        font-size: 15px;
      }

      .smart-score-section,
      .consumers-section,
      .insights-section {
        padding: 18px;
      }

      .consumer {
        padding: 12px;
      }

    }
  `;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "energy-dashboard-card",
  name: "Energy Dashboard",
  description: "Energy Dashboard backed by Solar Battery Economy",
});

import { LitElement, html, css, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  DashboardConsumer,
  DashboardInsight,
  DashboardPayload,
  EnergyDashboardCardConfig,
  HomeAssistant,
} from "./types";

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

  public setConfig(config: EnergyDashboardCardConfig): void {
    if (!config || config.type !== "custom:energy-dashboard-card") {
      throw new Error("Invalid configuration for energy-dashboard-card");
    }

    if (!config.config_entry_id) {
      throw new Error("config_entry_id is required");
    }

    this.config = config;
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("hass") && this.hass && !this.data && !this.loading) {
      void this.loadDashboardData();
    }
  }

  private async loadDashboardData(): Promise<void> {
    if (!this.hass) return;

    this.loading = true;
    this.error = undefined;

    try {
      this.data = await this.hass.callWS<DashboardPayload>({
        type: "solar_battery_economy/get_dashboard_data",
        config_entry_id: this.config.config_entry_id,
      });
    } catch (error) {
      this.error =
        error instanceof Error
          ? error.message
          : JSON.stringify(error, null, 2);
    } finally {
      this.loading = false;
    }
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

          <div class="dashboard-timeline-prices">
            <div class="dashboard-timeline">
              ${this.renderTimelineSection()}
            </div>

            <div class="dashboard-upcoming">
              ${this.renderUpcomingPricesSection()}
            </div>
          </div>

          <div class="dashboard-kpi">
            ${this.renderKpiSection()}
          </div>

          <div class="dashboard-smart-score">
            ${this.renderSmartScoreSection()}
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

    return html`
      <section class="price-header">
        <div class="overview-layout">
          <div class="current-price-card">
            <div class="eyebrow">IMPORTPRIS JUST NU</div>

            <div class="current-price">
              ${this.formatPrice(current.import)}
              <span class="unit">kr/kWh</span>
            </div>

            <div class="current-time">
              ${this.formatInterval(current.start, current.end)}
            </div>

            <div class="price-status ${priceClassKey}">
              <div class="status-label">${priceClass}</div>
            </div>
          </div>

          <div class="price-stats">
            <div class="stat">
              <div class="stat-label">Lägsta importpris idag</div>
              <div class="stat-value">
                ${this.formatPrice(statistics.lowest_import_price)}
              </div>
            </div>

            <div class="stat">
              <div class="stat-label">Högsta importpris idag</div>
              <div class="stat-value">
                ${this.formatPrice(statistics.highest_import_price)}
              </div>
            </div>

            <div class="stat">
              <div class="stat-label">Snitt importpris idag</div>
              <div class="stat-value">
                ${this.formatPrice(statistics.average_import_price)}
              </div>
            </div>

            <div class="stat">
              <div class="stat-label">Prisindex (PQI)</div>
              <div class="stat-value">
                ${this.formatNumber(intelligence.price_quality_index, 0)}/100
              </div>
            </div>
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

    return html`
      <section class="timeline-section">
        <div class="timeline-heading">
          <div>
            <div class="section-title">
              IMPORTPRIS & HUSFÖRBRUKNING
            </div>
            <div class="timeline-subtitle">
              Senaste 24h och kommande importpriser
            </div>
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
              ${this.renderHistoricalImportPrice(timeline)}
              ${this.renderFutureImportPrice(timeline)}
              ${this.renderNowMarker(timeline)}
              ${this.renderTimelineLabels(timeline)}
            </svg>
          `}
        </div>
      </section>
    `;
  }

  private buildTimelineModel() {
    if (!this.data) return undefined;

    const historyStart = new Date(this.data.window.start).getTime();
    const historyEnd = new Date(this.data.window.end).getTime();
    const now = Date.now();

    if (!Number.isFinite(historyStart) || !Number.isFinite(historyEnd)) {
      return undefined;
    }

    const forecast = this.data.price.forecast
      .filter((item) => {
        const start = new Date(item.start).getTime();
        const end = new Date(item.end).getTime();
        return Number.isFinite(start) && Number.isFinite(end) && end > now;
      })
      .sort(
        (a, b) =>
          new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

    const futureEnd = forecast.length
      ? Math.max(
          ...forecast.map((item) => new Date(item.end).getTime()),
        )
      : historyEnd;

    const start = Math.min(historyStart, now - 24 * 60 * 60 * 1000);
    const end = Math.max(futureEnd, now);

    if (!(end > start)) return undefined;

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
      ...this.data.price_history.import_intervals.map((item) => item.import),
      ...forecast.map((item) => item.import),
    ].filter((value) => Number.isFinite(value) && value >= 0);

    const maxImport = Math.max(
      this.data.price.current.import,
      ...importValues,
      0.01,
    );
    const importMax = this.roundChartMax(maxImport);

    const houseValues = this.data.house_history
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
      now: Math.min(Math.max(now, start), end),
      x,
      yImport,
      yHouse,
      importMax,
      houseMax,
      historyEnd,
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

  private renderTimelineGrid(timeline: ReturnType<typeof this.buildTimelineModel>) {
    if (!timeline) return svg``;

    const yTicks = [0, 0.25, 0.5, 0.75, 1];
    const timeTicks = 6;
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

      <line
        x1="${timeline.width - timeline.plot.right}"
        x2="${timeline.width - timeline.plot.right}"
        y1="${timeline.plot.top}"
        y2="${timeline.plot.top + timeline.plotHeight}"
        stroke="${gridColor}"
        stroke-width="1"
        opacity="0.35"
      ></line>

      <text
        x="${timeline.width - timeline.plot.right + 6}"
        y="${timeline.plot.top - 7}"
        text-anchor="start"
        fill="${secondary}"
        font-size="10"
      >kWh</text>

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

      ${Array.from({ length: timeTicks + 1 }, (_, index) => {
        const timestamp =
          timeline.start +
          ((timeline.end - timeline.start) / timeTicks) * index;
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
        end <= timeline.start ||
        start >= timeline.end ||
        item.energy_kwh <= 0
      ) {
        return svg``;
      }

      const clippedStart = Math.max(start, timeline.start);
      const clippedEnd = Math.min(end, timeline.end);
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
          fill="var(--primary-color)"
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
          item.end > timeline.start &&
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
            stroke="var(--primary-color)"
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
      }))
      .filter(
        (item) =>
          Number.isFinite(item.start) &&
          Number.isFinite(item.end) &&
          Number.isFinite(item.import) &&
          item.end > item.start,
      );

    if (!future.length) return svg``;

    const path = future
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
        stroke="var(--warning-color)"
        stroke-width="2.5"
        stroke-dasharray="6 5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    `;
  }

  private renderNowMarker(timeline: ReturnType<typeof this.buildTimelineModel>) {
    if (!timeline) return svg``;

    const x = timeline.x(timeline.now);

    return svg`
      <line
        x1="${x}"
        x2="${x}"
        y1="${timeline.plot.top - 4}"
        y2="${timeline.plot.top + timeline.plotHeight}"
        stroke="var(--primary-text-color)"
        stroke-width="1.5"
        stroke-dasharray="3 4"
        opacity="0.85"
      ></line>
      <rect
        x="${x - 18}"
        y="0"
        width="36"
        height="18"
        rx="9"
        fill="var(--primary-text-color)"
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

    const labels = 6;

    return svg`
      ${Array.from({ length: labels + 1 }, (_, index) => {
        const timestamp =
          timeline.start +
          ((timeline.end - timeline.start) / labels) * index;
        const date = new Date(timestamp);
        const x = timeline.x(timestamp);

        return svg`
          <text
            x="${x}"
            y="${timeline.height - 10}"
            text-anchor="${index === 0 ? "start" : index === labels ? "end" : "middle"}"
            fill="var(--secondary-text-color)"
            font-size="10"
          >${this.formatTimeLabel(date)}</text>
        `;
      })}
    `;
  }

  private formatTimeLabel(date: Date): string {
    return new Intl.DateTimeFormat("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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

    return html`
      <section class="upcoming-section">
        <div class="section-title">KOMMANDE PRISER (15 MINUTER)</div>

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
      <section class="kpi-section">
        <div class="section-title">NYCKELTAL – SENASTE 24H</div>

        <div class="kpi-grid">
          <div class="kpi-summary">
            <div class="kpi">
              <div class="kpi-label">Importkostnad</div>

              <div class="kpi-value">
                ${this.formatNumber(house.cost, 2)}
                <span>kr</span>
              </div>

              <div class="kpi-meta">
                Total importkostnad
              </div>
            </div>

            <div class="kpi">
              <div class="kpi-label">Förbrukning</div>

              <div class="kpi-value">
                ${this.formatNumber(house.consumption_kwh, 2)}
                <span>kWh</span>
              </div>

              <div class="kpi-meta">
                Husets totala förbrukning
              </div>
            </div>

            <div class="kpi">
              <div class="kpi-label">Under medianpris</div>

              <div class="kpi-value">
                ${this.formatNumber(house.cheap_usage_percent, 1)}
                <span>%</span>
              </div>

              <div class="kpi-meta">
                Av energiförbrukningen
              </div>
            </div>
          </div>

          <div class="kpi kpi-next-period">
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
      </section>
    `;
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
        <div class="section-title">SMART SCORE</div>
        <div class="smart-score-card">
          <div class="smart-score-main">
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

  private renderConsumersSection() {
    if (!this.data) return html``;

    const consumers = Object.values(this.data.consumers);

    return html`
      <section class="consumers-section">
        <div class="section-title">FÖRBRUKNING PER ENHET</div>

        <div class="consumer-list-header" aria-hidden="true">
          <div>Enhet</div>
          <div>Förbrukning</div>
          <div>Andel</div>
          <div class="consumer-average-price-column">Snittpris</div>
        </div>

        <div class="consumer-list">
          ${consumers.map((consumer) =>
            this.renderConsumer(consumer),
          )}
        </div>
      </section>
    `;
  }

  private renderConsumer(consumer: DashboardConsumer) {
    const analysis = consumer.analysis;
    const hasConsumption = analysis.energy_kwh > 0;

    const name =
      consumer.name || this.getConsumerFallbackName(consumer);

    return html`
      <div class="consumer">
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

        <div class="consumer-metric-value">
          ${this.formatNumber(analysis.share_percent, 1)}
          <span>%</span>
        </div>

        <div class="consumer-metric-value consumer-average-price-column">
          ${analysis.average_import_price !== null
            ? html`
                ${this.formatPrice(analysis.average_import_price)}
                <span>kr/kWh</span>
              `
            : html`<span class="muted-value">—</span>`}
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
    if (!this.data || this.data.insights.length === 0) {
      return html``;
    }

    return html`
      <section class="insights-section">
        <div class="section-title">INSIGHTS – SENASTE 24H</div>

        <div class="insights-list">
          ${this.data.insights.map((insight) =>
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
          <div class="insight insight-warning">
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
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return "—";
    }

    const formatter = new Intl.DateTimeFormat("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formatter.format(startDate)}–${formatter.format(endDate)}`;
  }

  // ---------------------------------------------------------------------------
  // STYLES
  // ---------------------------------------------------------------------------

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
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
    .dashboard-kpi,
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
      min-width: 0;
    }

    .dashboard-upcoming > .upcoming-section,
    .upcoming-list {
      box-sizing: border-box;
      max-width: 100%;
      min-width: 0;
      width: 100%;
    }

    .price-header {
      padding: 22px;
    }

    .overview-layout {
      display: grid;
      grid-template-columns: minmax(240px, 0.42fr) minmax(0, 1fr);
      gap: 12px;
      min-width: 0;
    }

    .current-price-card {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      min-width: 0;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .price-stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      min-width: 0;
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

    .price-status {
      min-width: 120px;
      max-width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      text-align: right;
      align-self: flex-start;
      margin-top: 14px;
    }

    .status-label {
      font-size: 14px;
      font-weight: 700;
    }

    .very_cheap .status-label,
    .cheap .status-label {
      color: var(--success-color);
    }

    .normal .status-label {
      color: var(--primary-text-color);
    }

    .expensive .status-label {
      color: var(--warning-color);
    }

    .very_expensive .status-label {
      color: var(--error-color);
    }

    .stat {
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
      border-top: 2px solid var(--primary-color);
    }

    .legend-line.future {
      border-top: 2px dashed var(--warning-color);
    }

    .legend-bar {
      background: var(--primary-color);
      border-radius: 1px;
      display: inline-block;
      height: 8px;
      opacity: 0.3;
      width: 14px;
    }

    .timeline-chart {
      overflow: hidden;
      padding: 0;
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
      overflow-x: auto;
      padding: 2px 1px 8px;
      scrollbar-width: thin;
    }

    .upcoming-price {
      box-sizing: border-box;
      border-radius: 2px;
      height: 26px;
      min-width: 10px;
      width: 10px;
    }

    .upcoming-price.very_cheap {
      background: color-mix(in srgb, var(--success-color) 85%, var(--primary-background-color));
    }

    .upcoming-price.cheap {
      background: color-mix(in srgb, var(--success-color) 55%, var(--primary-background-color));
    }

    .upcoming-price.normal {
      background: color-mix(in srgb, var(--secondary-text-color) 35%, var(--primary-background-color));
    }

    .upcoming-price.expensive {
      background: color-mix(in srgb, var(--warning-color) 65%, var(--primary-background-color));
    }

    .upcoming-price.very_expensive {
      background: color-mix(in srgb, var(--error-color) 85%, var(--primary-background-color));
    }

    /* KPI */

    .kpi-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
    }

    .section-title {
      margin-bottom: 14px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .kpi-summary {
      display: grid;
      gap: 12px;
      grid-column: span 3;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      min-width: 0;
    }

    .kpi {
      min-width: 0;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .kpi-label {
      color: var(--secondary-text-color);
      font-size: 11px;
      line-height: 1.3;
      margin-bottom: 7px;
    }

    .kpi-value {
      font-size: 22px;
      font-weight: 650;
      line-height: 1.15;
      min-width: 0;
      white-space: nowrap;
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
      font-size: 10px;
      line-height: 1.35;
      margin-top: 6px;
    }

    /* SMART SCORE */

    .smart-score-section {
      border-top: 1px solid var(--divider-color);
      padding: 20px 22px 22px;
    }

    .smart-score-card {
      display: grid;
      grid-template-columns: minmax(180px, 0.8fr) minmax(0, 1.2fr);
      gap: 18px;
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .smart-score-value {
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
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      align-items: center;
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
    }

    .consumer-list-header,
    .consumer {
      align-items: center;
      column-gap: 10px;
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 0.7fr) minmax(0, 1.1fr);
      min-width: 0;
    }

    .consumer-list-header {
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 600;
      padding: 0 0 8px;
    }

    .consumer {
      border-top: 1px solid var(--divider-color);
      padding: 10px 0;
    }

    .consumer-name {
      font-size: 13px;
      font-weight: 600;
      min-width: 0;
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
      background: var(--success-color);
      color: var(--primary-background-color);
    }

    .insight-warning .insight-icon {
      background: var(--warning-color);
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
    }

    @container dashboard-card (max-width: 480px) {
      .price-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @container dashboard-card (max-width: 860px) {
      .dashboard-lower-grid {
        grid-template-columns: minmax(0, 1fr);
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
    }

    @container dashboard-card (max-width: 700px) {
      .kpi-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .kpi-summary {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        gap: 0;
        grid-column: auto;
        grid-template-columns: minmax(0, 1fr);
        overflow: hidden;
      }

      .kpi-summary .kpi {
        border: 0;
        border-radius: 0;
        border-bottom: 1px solid var(--divider-color);
      }

      .kpi-summary .kpi:last-child {
        border-bottom: 0;
      }

      .kpi-value {
        white-space: normal;
        overflow-wrap: anywhere;
      }
    }

    @container dashboard-card (max-width: 520px) {
      .consumer-list-header,
      .consumer {
        grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 0.7fr);
      }

      .consumer-average-price-column {
        display: none;
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

      .kpi-section,
      .smart-score-section,
      .consumers-section,
      .insights-section {
        padding: 18px;
      }

      .kpi-grid {
        gap: 8px;
      }

      .kpi {
        padding: 12px;
      }

      .kpi-value {
        font-size: 19px;
      }

      .consumer {
        padding: 12px;
      }

      .smart-score-card {
        grid-template-columns: 1fr;
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

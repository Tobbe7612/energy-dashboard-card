import type { DashboardPayload, PriceInterval } from "./types";
import { DASHBOARD_TIME_ZONE } from "./time-formatters";

export type DashboardView = "yesterday" | "today" | "tomorrow";
export const DEFAULT_DASHBOARD_VIEW: DashboardView = "today";

const STOCKHOLM_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: DASHBOARD_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function getStockholmDateParts(timestamp: number) {
  const parts = STOCKHOLM_DATE_TIME_FORMATTER.formatToParts(new Date(timestamp));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function getStockholmMidnight(timestamp: number, dayOffset: number): number {
  const { year, month, day } = getStockholmDateParts(timestamp);
  const calendarDate = new Date(Date.UTC(year, month - 1, day + dayOffset));
  const targetAsUtc = Date.UTC(
    calendarDate.getUTCFullYear(),
    calendarDate.getUTCMonth(),
    calendarDate.getUTCDate(),
  );

  let result = targetAsUtc;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const local = getStockholmDateParts(result);
    const localAsUtc = Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second,
    );
    result = targetAsUtc - (localAsUtc - result);
  }

  return result;
}

export interface TimelineBounds {
  start: number;
  end: number;
  includeEnd: boolean;
}

export function getTimelineBounds(
  payload: DashboardPayload,
  view: DashboardView,
): TimelineBounds | undefined {
  const windowStart = new Date(payload.window.start).getTime();
  const todayStart = new Date(payload.window.today_start).getTime();

  if (
    !Number.isFinite(windowStart) ||
    !Number.isFinite(todayStart)
  ) {
    return undefined;
  }

  const tomorrowStart = getStockholmMidnight(todayStart, 1);
  const followingStart = getStockholmMidnight(todayStart, 2);
  const bounds = view === "yesterday"
    ? { start: windowStart, end: todayStart, includeEnd: false }
    : view === "today"
      ? { start: todayStart, end: tomorrowStart, includeEnd: false }
      : { start: tomorrowStart, end: followingStart, includeEnd: false };

  return bounds.end > bounds.start ? bounds : undefined;
}

export function isTimestampInTimeline(
  timestamp: number,
  bounds: TimelineBounds,
): boolean {
  return Number.isFinite(timestamp) &&
    timestamp >= bounds.start &&
    (bounds.includeEnd ? timestamp <= bounds.end : timestamp < bounds.end);
}

export function shouldShowNowMarker(view: DashboardView): boolean {
  return view === "today";
}

export function shouldIncludeForecast(view: DashboardView): boolean {
  return view !== "yesterday";
}

export function shouldIncludeConsumption(view: DashboardView): boolean {
  return view !== "tomorrow";
}

export function isHistoricalPriceInTimeline(
  timestamp: number,
  bounds: TimelineBounds,
  now: number,
): boolean {
  return isTimestampInTimeline(timestamp, bounds) && timestamp < now;
}

export function isConsumptionTimestampInTimeline(
  timestamp: number,
  bounds: TimelineBounds,
  now: number,
): boolean {
  return isTimestampInTimeline(timestamp, bounds) && timestamp < now;
}

export function isFuturePriceInTimeline(
  start: number,
  end: number,
  bounds: TimelineBounds,
  now: number,
): boolean {
  return isTimestampInTimeline(start, bounds) &&
    Number.isFinite(end) &&
    end > now;
}

export function getFuturePriceIntervals(
  forecast: PriceInterval[],
  bounds: TimelineBounds,
  now: number,
): PriceInterval[] {
  return forecast
    .filter((item) =>
      isFuturePriceInTimeline(
        new Date(item.start).getTime(),
        new Date(item.end).getTime(),
        bounds,
        now,
      ),
    )
    .sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
}

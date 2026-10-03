import type { DashboardPayload } from "./types";

export type DashboardView = "yesterday" | "today-forward";
export const DEFAULT_DASHBOARD_VIEW: DashboardView = "today-forward";

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
  const windowEnd = new Date(payload.window.end).getTime();

  if (
    !Number.isFinite(windowStart) ||
    !Number.isFinite(todayStart) ||
    !Number.isFinite(windowEnd)
  ) {
    return undefined;
  }

  const bounds = view === "yesterday"
    ? { start: windowStart, end: todayStart, includeEnd: false }
    : { start: todayStart, end: windowEnd, includeEnd: true };

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
  return view === "today-forward";
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

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function transpileTypeScript(url) {
  const source = await readFile(url, "utf8");
  let output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;

  for (const match of output.matchAll(/from (["'])(.+?)\1/g)) {
    const specifier = match[2];
    if (!specifier.startsWith(".")) continue;

    const dependencyUrl = new URL(
      specifier.endsWith(".ts") ? specifier : `${specifier}.ts`,
      url,
    );
    const dependency = await transpileTypeScript(dependencyUrl);
    output = output.replace(
      match[0],
      `from "data:text/javascript;base64,${Buffer.from(dependency).toString("base64")}"`,
    );
  }

  return output;
}

async function importTypeScript(path) {
  const output = await transpileTypeScript(new URL(path, import.meta.url));
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}

const timeline = await importTypeScript("../src/timeline-view.ts");
const subscriptionModule = await importTypeScript("../src/dashboard-subscription.ts");
const timeFormatters = await importTypeScript("../src/time-formatters.ts");
const swedishTimeFormatter = timeFormatters.SWEDISH_TIME_FORMATTER;
const yesterdayStart = Date.parse("2026-10-02T00:00:00+02:00");
const todayStart = Date.parse("2026-10-03T00:00:00+02:00");
const windowEnd = Date.parse("2026-10-05T00:00:00+02:00");
const payload = {
  window: {
    start: new Date(yesterdayStart).toISOString(),
    today_start: new Date(todayStart).toISOString(),
    end: new Date(windowEnd).toISOString(),
  },
};

test("Swedish time label formats local 08:05 as 08:05", () => {
  const stockholmTime = new Date("2026-10-03T06:05:00.000Z");
  assert.equal(
    timeFormatters.formatTimeLabelWithFormatter(swedishTimeFormatter, stockholmTime),
    "08:05",
  );
});

test("Swedish interval formats local 08:05–08:20", () => {
  const localStart = new Date("2026-10-03T06:05:00.000Z");
  const localEnd = new Date("2026-10-03T06:20:00.000Z");
  assert.equal(
    timeFormatters.formatIntervalWithFormatter(
      swedishTimeFormatter,
      localStart.toISOString(),
      localEnd.toISOString(),
    ),
    "08:05–08:20",
  );
});

test("Swedish interval keeps the invalid date fallback", () => {
  assert.equal(
    timeFormatters.formatIntervalWithFormatter(
      swedishTimeFormatter,
      "invalid",
      "2026-10-03T06:20:00.000Z",
    ),
    "—",
  );
});

test("the three timeline views default to IDAG", () => {
  assert.equal(timeline.DEFAULT_DASHBOARD_VIEW, "today");
});

test("IGÅR includes window.start and excludes today_start", () => {
  const bounds = timeline.getTimelineBounds(payload, "yesterday");
  assert.equal(timeline.isTimestampInTimeline(yesterdayStart, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(todayStart - 1, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(todayStart, bounds), false);
});

test("IDAG uses today local midnight through tomorrow local midnight", () => {
  const bounds = timeline.getTimelineBounds(payload, "today");
  const tomorrowStart = Date.parse("2026-10-04T00:00:00+02:00");
  assert.equal(bounds.start, todayStart);
  assert.equal(bounds.end, tomorrowStart);
  assert.equal(timeline.isTimestampInTimeline(todayStart, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(tomorrowStart - 1, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(tomorrowStart, bounds), false);
});

test("IMORGON uses tomorrow local midnight through the following midnight", () => {
  const bounds = timeline.getTimelineBounds(payload, "tomorrow");
  const tomorrowStart = Date.parse("2026-10-04T00:00:00+02:00");
  const followingStart = Date.parse("2026-10-05T00:00:00+02:00");
  assert.equal(bounds.start, tomorrowStart);
  assert.equal(bounds.end, followingStart);
  assert.equal(timeline.isTimestampInTimeline(tomorrowStart, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(followingStart - 1, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(followingStart, bounds), false);
});

test("all three views use half-open boundaries", () => {
  const todayBounds = timeline.getTimelineBounds(payload, "today");
  const tomorrowBounds = timeline.getTimelineBounds(payload, "tomorrow");
  const yesterdayBounds = timeline.getTimelineBounds(payload, "yesterday");
  const historicalPriceAtTodayStart = todayStart;

  assert.equal(
    timeline.isTimestampInTimeline(historicalPriceAtTodayStart, yesterdayBounds),
    false,
  );
  assert.equal(timeline.isTimestampInTimeline(yesterdayStart, yesterdayBounds), true);
  assert.equal(timeline.isTimestampInTimeline(todayStart, todayBounds), true);
  assert.equal(timeline.isTimestampInTimeline(todayBounds.end, todayBounds), false);
  assert.equal(timeline.isTimestampInTimeline(tomorrowBounds.start, todayBounds), false);
  assert.equal(timeline.isTimestampInTimeline(tomorrowBounds.start, tomorrowBounds), true);
  assert.equal(timeline.isTimestampInTimeline(tomorrowBounds.end, tomorrowBounds), false);
});

test("Stockholm calendar bounds handle the spring DST day as 23 hours", () => {
  const springPayload = {
    window: {
      start: "2026-03-27T23:00:00.000Z",
      today_start: "2026-03-28T23:00:00.000Z",
      end: "2026-03-30T22:00:00.000Z",
    },
  };
  const bounds = timeline.getTimelineBounds(springPayload, "today");
  assert.equal(bounds.start, Date.parse("2026-03-29T00:00:00+01:00"));
  assert.equal(bounds.end, Date.parse("2026-03-30T00:00:00+02:00"));
  assert.equal(bounds.end - bounds.start, 23 * 60 * 60 * 1000);
});

test("Stockholm calendar bounds handle the autumn DST day as 25 hours", () => {
  const autumnPayload = {
    window: {
      start: "2026-10-23T22:00:00.000Z",
      today_start: "2026-10-24T22:00:00.000Z",
      end: "2026-10-26T23:00:00.000Z",
    },
  };
  const bounds = timeline.getTimelineBounds(autumnPayload, "today");
  assert.equal(bounds.start, Date.parse("2026-10-25T00:00:00+02:00"));
  assert.equal(bounds.end, Date.parse("2026-10-26T00:00:00+01:00"));
  assert.equal(bounds.end - bounds.start, 25 * 60 * 60 * 1000);
});

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function requestCallbacks(state) {
  return {
    onStart: () => { state.loading = true; state.error = undefined; },
    onSuccess: (result) => { state.data = result; },
    onFailure: (error) => { state.error = error.message; },
    onFinish: () => { state.loading = false; },
  };
}

test("stale fallback success leaves data, error, and loading untouched", async () => {
  const guard = new subscriptionModule.DashboardRequestGuard();
  const connection = {};
  const state = { data: "old data", error: undefined, loading: false };
  const request = deferred();
  const context = { connection, configEntryId: "entry", isConnected: true };
  const run = guard.run(
    connection,
    "entry",
    () => context,
    () => request.promise,
    requestCallbacks(state),
  );

  guard.invalidate();
  state.loading = false;
  state.error = "current lifecycle error";
  const beforeStaleResponse = { ...state };
  request.resolve("stale data");
  await run;

  assert.deepEqual(state, beforeStaleResponse);
});

test("stale fallback failure leaves error and loading untouched", async () => {
  const guard = new subscriptionModule.DashboardRequestGuard();
  const connection = {};
  const state = { data: "current data", error: undefined, loading: false };
  const request = deferred();
  const context = { connection, configEntryId: "entry", isConnected: true };
  const run = guard.run(
    connection,
    "entry",
    () => context,
    () => request.promise,
    requestCallbacks(state),
  );

  guard.invalidate();
  state.loading = false;
  state.error = "current lifecycle error";
  const beforeStaleFailure = { ...state };
  request.reject(new Error("stale error"));
  await run;

  assert.deepEqual(state, beforeStaleFailure);
});

test("connection, config, or lifecycle invalidation allows a fresh fallback request", async () => {
  for (const invalidation of ["connection", "config", "lifecycle"]) {
    const guard = new subscriptionModule.DashboardRequestGuard();
    let context = { connection: {}, configEntryId: "entry-1", isConnected: true };
    const oldRequest = deferred();
    const newRequest = deferred();
    const state = { data: undefined, error: undefined, loading: false };
    const callbacks = requestCallbacks(state);
    const oldRun = guard.run(
      context.connection,
      context.configEntryId,
      () => context,
      () => oldRequest.promise,
      callbacks,
    );

    if (invalidation === "connection") context = { ...context, connection: {} };
    if (invalidation === "config") context = { ...context, configEntryId: "entry-2" };
    if (invalidation === "lifecycle") context = { ...context, isConnected: false };
    guard.invalidate();
    state.loading = false;
    if (invalidation === "lifecycle") context = { ...context, isConnected: true };

    let starts = 0;
    const currentCallbacks = {
      ...requestCallbacks(state),
      onStart: () => { starts += 1; requestCallbacks(state).onStart(); },
    };
    const newRun = guard.run(
      context.connection,
      context.configEntryId,
      () => context,
      () => newRequest.promise,
      currentCallbacks,
    );
    assert.equal(starts, 1, `new request did not start after ${invalidation} change`);
    assert.equal(state.loading, true);

    oldRequest.resolve("stale data");
    await oldRun;
    assert.equal(state.data, undefined, `old ${invalidation} response replaced data`);
    assert.equal(state.loading, true, `old ${invalidation} response cleared loading`);

    newRequest.resolve("current data");
    await newRun;
    assert.equal(state.data, "current data");
    assert.equal(state.loading, false);
  }
});

test("current fallback success updates data and ends loading", async () => {
  const guard = new subscriptionModule.DashboardRequestGuard();
  const connection = {};
  const state = { data: undefined, error: "prior error", loading: false };
  const request = deferred();
  const context = { connection, configEntryId: "entry", isConnected: true };
  const run = guard.run(
    connection,
    "entry",
    () => context,
    () => request.promise,
    requestCallbacks(state),
  );

  assert.equal(state.loading, true);
  assert.equal(state.error, undefined);
  request.resolve("current data");
  await run;
  assert.equal(state.data, "current data");
  assert.equal(state.loading, false);
});

test("current fallback failure sets error and ends loading", async () => {
  const guard = new subscriptionModule.DashboardRequestGuard();
  const connection = {};
  const state = { data: undefined, error: undefined, loading: false };
  const request = deferred();
  const context = { connection, configEntryId: "entry", isConnected: true };
  const run = guard.run(
    connection,
    "entry",
    () => context,
    () => request.promise,
    requestCallbacks(state),
  );

  request.reject(new Error("current error"));
  await run;
  assert.equal(state.error, "current error");
  assert.equal(state.loading, false);
});

test("switching views does not start another websocket subscription", async () => {
  let subscribeCount = 0;
  const connection = {
    subscribeMessage: async () => {
      subscribeCount += 1;
      return () => {};
    },
  };
  const subscription = new subscriptionModule.DashboardSubscription();
  await subscription.subscribe(connection, "entry", () => {}, assert.fail);
  let view = timeline.DEFAULT_DASHBOARD_VIEW;
  view = "yesterday";
  assert.equal(view, "yesterday");
  assert.equal(subscribeCount, 1);
  subscription.unsubscribeNow();
});

test("subscription receives the initial complete payload", async () => {
  let callback;
  const received = [];
  const first = { ...payload, revision: 1 };
  const connection = {
    subscribeMessage: async (onMessage) => {
      callback = onMessage;
      onMessage(first);
      return () => {};
    },
  };
  const subscription = new subscriptionModule.DashboardSubscription();

  await subscription.subscribe(connection, "entry", (data) => received.push(data), assert.fail);
  assert.deepEqual(received, [first]);
  subscription.unsubscribeNow();
});

test("subscription updates replace the stored complete payload", async () => {
  let callback;
  let stored;
  const first = { ...payload, revision: 1 };
  const second = { ...payload, revision: 2 };
  const connection = {
    subscribeMessage: async (onMessage) => {
      callback = onMessage;
      onMessage(first);
      return () => {};
    },
  };
  const subscription = new subscriptionModule.DashboardSubscription();

  await subscription.subscribe(connection, "entry", (data) => { stored = data; }, assert.fail);
  callback(second);
  assert.equal(stored, second);
  subscription.unsubscribeNow();
});

test("disconnect unsubscribes", async () => {
  let subscribeCount = 0;
  let unsubscribeCount = 0;
  const connection = {
    subscribeMessage: async () => {
      subscribeCount += 1;
      return () => { unsubscribeCount += 1; };
    },
  };
  const subscription = new subscriptionModule.DashboardSubscription();
  const onPayload = () => {};
  const onError = assert.fail;

  await Promise.all([
    subscription.subscribe(connection, "entry", onPayload, onError),
    subscription.subscribe(connection, "entry", onPayload, onError),
  ]);
  assert.equal(subscribeCount, 1);
  subscription.unsubscribeNow();
  assert.equal(unsubscribeCount, 1);
});

test("reconnect creates one fresh subscription", async () => {
  let subscribeCount = 0;
  let unsubscribeCount = 0;
  const connection = {
    subscribeMessage: async () => {
      subscribeCount += 1;
      return () => { unsubscribeCount += 1; };
    },
  };
  const subscription = new subscriptionModule.DashboardSubscription();
  const onPayload = () => {};
  const onError = assert.fail;
  await Promise.all([
    subscription.subscribe(connection, "entry", onPayload, onError),
    subscription.subscribe(connection, "entry", onPayload, onError),
  ]);
  assert.equal(subscribeCount, 1);
  subscription.unsubscribeNow();
  await subscription.subscribe(connection, "entry", onPayload, onError);
  assert.equal(subscribeCount, 2);
  subscription.unsubscribeNow();
  assert.equal(unsubscribeCount, 2);
});

test("IGÅR and IMORGON have no NOW marker", () => {
  assert.equal(timeline.shouldShowNowMarker("yesterday"), false);
  assert.equal(timeline.shouldShowNowMarker("tomorrow"), false);
});

test("only IDAG has the NOW marker", () => {
  assert.equal(timeline.shouldShowNowMarker("today"), true);
});

test("forecast and consumption axis/legend policies follow the selected view", () => {
  assert.equal(timeline.shouldIncludeForecast("yesterday"), false);
  assert.equal(timeline.shouldIncludeForecast("today"), true);
  assert.equal(timeline.shouldIncludeForecast("tomorrow"), true);
  assert.equal(timeline.shouldIncludeConsumption("yesterday"), true);
  assert.equal(timeline.shouldIncludeConsumption("today"), true);
  assert.equal(timeline.shouldIncludeConsumption("tomorrow"), false);
});

test("IDAG separates historical and forecast prices at NOW", () => {
  const bounds = timeline.getTimelineBounds(payload, "today");
  const now = todayStart + 60 * 60 * 1000;
  assert.equal(timeline.isHistoricalPriceInTimeline(now - 1, bounds, now), true);
  assert.equal(timeline.isHistoricalPriceInTimeline(now, bounds, now), false);
  assert.equal(
    timeline.isFuturePriceInTimeline(now + 1, now + 60_000, bounds, now),
    true,
  );
  assert.equal(
    timeline.getFuturePriceIntervals([
      {
        start: new Date(now + 1).toISOString(),
        end: new Date(now + 60_000).toISOString(),
      },
    ], bounds, now).length,
    1,
  );
  const tomorrowBounds = timeline.getTimelineBounds(payload, "tomorrow");
  assert.equal(
    timeline.isHistoricalPriceInTimeline(tomorrowBounds.start, tomorrowBounds, now),
    false,
  );
});

test("consumption is limited to before NOW and excluded for IMORGON", () => {
  const bounds = timeline.getTimelineBounds(payload, "today");
  const now = todayStart + 60 * 60 * 1000;
  assert.equal(timeline.isConsumptionTimestampInTimeline(now - 1, bounds, now), true);
  assert.equal(timeline.isConsumptionTimestampInTimeline(now, bounds, now), false);
  assert.equal(timeline.isConsumptionTimestampInTimeline(now + 1, bounds, now), false);
  assert.equal(timeline.shouldIncludeConsumption("tomorrow"), false);
});

test("tomorrow displays only available forecast intervals and fabricates none", () => {
  const bounds = timeline.getTimelineBounds(payload, "tomorrow");
  const tomorrowPrice = {
    start: "2026-10-04T01:00:00+02:00",
    end: "2026-10-04T01:15:00+02:00",
  };
  assert.deepEqual(
    timeline.getFuturePriceIntervals([tomorrowPrice], bounds, todayStart),
    [tomorrowPrice],
  );
  assert.deepEqual(
    timeline.getFuturePriceIntervals([], bounds, todayStart),
    [],
  );
});

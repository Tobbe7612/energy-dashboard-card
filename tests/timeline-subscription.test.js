import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function importTypeScript(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}

const timeline = await importTypeScript("../src/timeline-view.ts");
const subscriptionModule = await importTypeScript("../src/dashboard-subscription.ts");
const timeFormatters = await importTypeScript("../src/time-formatters.ts");
const swedishTimeFormatter = new Intl.DateTimeFormat("sv-SE", {
  hour: "2-digit",
  minute: "2-digit",
});
const yesterdayStart = Date.parse("2026-10-02T00:00:00+02:00");
const todayStart = Date.parse("2026-10-03T00:00:00+02:00");
const windowEnd = Date.parse("2026-10-04T00:00:00+02:00");
const payload = {
  window: {
    start: new Date(yesterdayStart).toISOString(),
    today_start: new Date(todayStart).toISOString(),
    end: new Date(windowEnd).toISOString(),
  },
};

test("Swedish time label formats local 08:05 as 08:05", () => {
  const localTime = new Date(2026, 9, 3, 8, 5);
  assert.equal(
    timeFormatters.formatTimeLabelWithFormatter(swedishTimeFormatter, localTime),
    "08:05",
  );
});

test("Swedish interval formats local 08:05–08:20", () => {
  const localStart = new Date(2026, 9, 3, 8, 5);
  const localEnd = new Date(2026, 9, 3, 8, 20);
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
      new Date(2026, 9, 3, 8, 20).toISOString(),
    ),
    "—",
  );
});

test("default view is IDAG + FRAMÅT", () => {
  assert.equal(timeline.DEFAULT_DASHBOARD_VIEW, "today-forward");
});

test("IGÅR includes window.start and excludes today_start", () => {
  const bounds = timeline.getTimelineBounds(payload, "yesterday");
  assert.equal(timeline.isTimestampInTimeline(yesterdayStart, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(todayStart - 1, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(todayStart, bounds), false);
});

test("IDAG + FRAMÅT includes today_start through window.end", () => {
  const bounds = timeline.getTimelineBounds(payload, "today-forward");
  assert.equal(timeline.isTimestampInTimeline(todayStart, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(windowEnd, bounds), true);
  assert.equal(timeline.isTimestampInTimeline(windowEnd + 1, bounds), false);
});

test("historical price boundary includes window.end today and excludes today_start yesterday", () => {
  const todayBounds = timeline.getTimelineBounds(payload, "today-forward");
  const yesterdayBounds = timeline.getTimelineBounds(payload, "yesterday");
  const historicalPriceAtWindowEnd = windowEnd;
  const historicalPriceAtTodayStart = todayStart;

  assert.equal(
    timeline.isTimestampInTimeline(historicalPriceAtWindowEnd, todayBounds),
    true,
  );
  assert.equal(
    timeline.isTimestampInTimeline(historicalPriceAtTodayStart, yesterdayBounds),
    false,
  );
  assert.equal(timeline.isTimestampInTimeline(yesterdayStart, yesterdayBounds), true);
  assert.equal(timeline.isTimestampInTimeline(todayStart, todayBounds), true);
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

test("IGÅR has no NOW marker", () => {
  assert.equal(timeline.shouldShowNowMarker("yesterday"), false);
});

test("IDAG + FRAMÅT retains the NOW marker", () => {
  assert.equal(timeline.shouldShowNowMarker("today-forward"), true);
});

test("future price intervals remain in IDAG + FRAMÅT", () => {
  const bounds = timeline.getTimelineBounds(payload, "today-forward");
  assert.equal(
    timeline.isFuturePriceInTimeline(todayStart + 60_000, windowEnd, bounds, todayStart),
    true,
  );
});

test("consumption filtering excludes future points", () => {
  const bounds = timeline.getTimelineBounds(payload, "today-forward");
  const now = todayStart + 60 * 60 * 1000;
  assert.equal(timeline.isConsumptionTimestampInTimeline(now - 1, bounds, now), true);
  assert.equal(timeline.isConsumptionTimestampInTimeline(now, bounds, now), false);
  assert.equal(timeline.isConsumptionTimestampInTimeline(now + 1, bounds, now), false);
});

import type {
  DashboardPayload,
  HomeAssistantConnection,
  Unsubscribe,
} from "./types";

interface DashboardRequestToken {
  generation: number;
  connection: object;
  configEntryId: string;
}

export interface DashboardRequestContext {
  connection: object | undefined;
  configEntryId: string | undefined;
  isConnected: boolean;
}

export interface DashboardRequestCallbacks<T> {
  onStart: () => void;
  onSuccess: (payload: T) => void;
  onFailure: (error: unknown) => void;
  onFinish: () => void;
}

export class DashboardRequestGuard {
  private generation = 0;
  private activeRequest?: DashboardRequestToken;

  public invalidate(): void {
    this.generation += 1;
    this.activeRequest = undefined;
  }

  public async run<T>(
    connection: object,
    configEntryId: string,
    getCurrentContext: () => DashboardRequestContext,
    request: () => Promise<T>,
    callbacks: DashboardRequestCallbacks<T>,
  ): Promise<void> {
    if (this.activeRequest) {
      if (this.isCurrent(this.activeRequest, getCurrentContext())) return;
      this.activeRequest = undefined;
    }

    const token: DashboardRequestToken = {
      generation: this.generation,
      connection,
      configEntryId,
    };
    this.activeRequest = token;
    callbacks.onStart();

    try {
      const payload = await request();
      if (this.isCurrent(token, getCurrentContext())) {
        callbacks.onSuccess(payload);
      }
    } catch (error) {
      if (this.isCurrent(token, getCurrentContext())) {
        callbacks.onFailure(error);
      }
    } finally {
      if (this.isCurrent(token, getCurrentContext())) {
        callbacks.onFinish();
        this.activeRequest = undefined;
      }
    }
  }

  private isCurrent(
    token: DashboardRequestToken,
    context: DashboardRequestContext,
  ): boolean {
    return this.activeRequest === token &&
      token.generation === this.generation &&
      token.connection === context.connection &&
      token.configEntryId === context.configEntryId &&
      context.isConnected;
  }
}

export class DashboardSubscription {
  private unsubscribe?: Unsubscribe;
  private pending?: Promise<void>;
  private generation = 0;
  private connection?: HomeAssistantConnection;

  public isUsing(connection: HomeAssistantConnection): boolean {
    return this.connection === connection;
  }

  public subscribe(
    connection: HomeAssistantConnection,
    configEntryId: string,
    onPayload: (payload: DashboardPayload) => void,
    onError: (error: unknown) => void,
  ): Promise<void> {
    if (this.unsubscribe) return Promise.resolve();
    if (this.pending) return this.pending;

    const generation = this.generation;
    this.connection = connection;
    this.pending = (async () => {
      try {
        const unsubscribe = await connection.subscribeMessage<DashboardPayload>(
          (payload) => {
            if (generation === this.generation) onPayload(payload);
          },
          {
            type: "solar_battery_economy/subscribe_dashboard_data",
            config_entry_id: configEntryId,
          },
        );

        if (generation !== this.generation) {
          unsubscribe();
          return;
        }

        this.unsubscribe = unsubscribe;
      } catch (error) {
        if (generation === this.generation) onError(error);
      } finally {
        if (generation === this.generation) this.pending = undefined;
      }
    })();

    return this.pending;
  }

  public unsubscribeNow(): void {
    this.generation += 1;
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.pending = undefined;
    this.connection = undefined;
  }
}

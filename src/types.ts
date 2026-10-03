export interface EnergyDashboardCardConfig {
  type: "custom:energy-dashboard-card";
  config_entry_id: string;
}

export interface PriceInterval {
  start: string;
  end: string;
  spot: number;
  import: number;
  export: number;
  price_class: string;
  price_quality: number;
}

export interface SpotHistoryInterval {
  start: string;
  end: string;
  spot: number;
  recorded_at: string;
}

export interface ImportHistoryInterval {
  start: string;
  end: string;
  import: number;
  recorded_at: string;
}

export interface HouseHistoryInterval {
  start: string;
  end: string;
  energy_kwh: number;
}

export interface DashboardPrice {
  current: PriceInterval;
  forecast: PriceInterval[];
}

export interface TodayImportPriceStatistics {
  lowest_import_price: number;
  highest_import_price: number;
  average_import_price: number;
  interval_count: number;
}

export interface CheapestFuturePeriod {
  start: string;
  end: string;
  duration_minutes: number;
  selection_mode: string;
  average_import_price: number;
  average_spot_price?: number;
}

export interface PriceIntelligence {
  current_price_class: string;
  price_quality_index: number;
  today_import_price_statistics: TodayImportPriceStatistics;
  cheapest_future_period?: CheapestFuturePeriod;
}

export interface HouseData {
  consumption_kwh: number;
  cost: number;
  average_import_price: number;
  cheap_usage_percent: number;
  expensive_usage_percent: number;
  battery_contribution_percent: number | null;
  smart_score: number | null;
  highest_cost_period?: Record<string, unknown>;
  lowest_cost_period?: Record<string, unknown>;
}

export interface ConsumerAnalysis {
  energy_kwh: number;
  cost: number;
  share_percent: number;
  average_import_price: number | null;
  cheap_usage_percent: number | null;
  expensive_usage_percent?: number | null;
  price_alignment_delta: number | null;
}

export interface ConsumerHistoryPoint {
  start: string;
  end: string;
  energy_kwh: number;
}

export interface ConsumerEvent {
  start?: string;
  end?: string;
  energy_kwh?: number;
  average_import_price?: number | null;
  max_power_kw?: number | null;
}

export interface DashboardConsumer {
  name?: string;
  energy_entity: string;
  analysis: ConsumerAnalysis;
  events: ConsumerEvent[];
  history: ConsumerHistoryPoint[];
}

export interface DashboardConsumers {
  [energyEntity: string]: DashboardConsumer;
}

export interface CheapConsumptionInsight {
  type: "cheap_consumption";
  cheap_usage_percent: number;
}

export interface ExpensiveConsumptionInsight {
  type: "expensive_consumption";
  expensive_usage_percent: number;
}

export interface CostPeriodInsight {
  type: "highest_cost_period" | "lowest_cost_period";
  start: string;
  end: string;
  energy_kwh: number;
  cost: number;
  import_price: number;
}

export interface ConsumerCostInsight {
  type: "consumer_cost";
  consumer_id: string;
  name: string;
  energy_kwh: number;
  cost: number;
  average_import_price: number | null;
}

export interface ConsumerShareInsight {
  type: "consumer_share";
  consumer_id: string;
  name: string;
  share_percent: number;
}

export interface ConsumerPriceAlignmentInsight {
  type: "consumer_price_alignment";
  consumer_id: string;
  name: string;
  price_alignment_delta: number;
}

export type DashboardInsight =
  | CheapConsumptionInsight
  | ExpensiveConsumptionInsight
  | CostPeriodInsight
  | ConsumerCostInsight
  | ConsumerShareInsight
  | ConsumerPriceAlignmentInsight;

export interface DashboardPayload {
  consumers: DashboardConsumers;
  grid_house_history: unknown[];
  house: HouseData;
  house_history: HouseHistoryInterval[];
  insights: DashboardInsight[];
  price: DashboardPrice;
  price_history: {
    import: unknown[];
    spot: SpotHistoryInterval[];
    import_intervals: ImportHistoryInterval[];
  };
  price_intelligence: PriceIntelligence;
  window: {
    start: string;
    end: string;
    today_start: string;
    hours: number;
  };
}

export type Unsubscribe = () => void;

export interface HomeAssistantConnection {
  subscribeMessage<T>(
    callback: (message: T) => void,
    message: { type: string; [key: string]: unknown },
  ): Promise<Unsubscribe>;
}

export interface HomeAssistant {
  callWS<T>(message: {
    type:
      | "call_service"
      | "subscribe_events"
      | "get_services"
      | "get_config"
      | string;
    [key: string]: unknown;
  }): Promise<T>;
  connection?: HomeAssistantConnection;
}

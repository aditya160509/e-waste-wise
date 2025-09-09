// Types used across the application. The previous schema for
// ImpactMetrics and RecyclingCenter has been updated to reflect the
// new JSON contracts provided by the user.

export interface Metals {
  copper_g: number;
  aluminium_g: number;
  rare_earths_g: number;
}

export interface ImpactMetric {
  label: string;
  co2_kg: number;
  water_liters: number;
  energy_kwh: number;
  metals: Metals;
  monetary_value_usd: number;
  global_recycling_rate_pct: number;
  lifecycle_co2_kg: number;
  hazards: string[];
  note: string;
  disposal_guidance: string;
}

export type ImpactFactors = ImpactMetric[];

export interface RecyclingCenter {
  name: string;
  city: string;
  verified: boolean;
  address: string;
  phone: string | null;
  maps_link?: string | null;
}
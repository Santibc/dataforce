export enum Tier {
  Fantastic = 'Fantastic',
  'Fantastic Plus' = 'Fantastic Plus',
  Great = 'Great',
  Fair = 'Fair',
  Poor = 'Poor',
}

export interface BestAndWorstPerformances {
  cc: string;
  cc_o: string;
  cdf: string;
  ced: string;
  dcr: string;
  distraction_rate: string;
  driver_amazon_id: string;
  dsb_dnr: string;
  fico_score: string;
  following_distance_rate: string;
  id: number;
  overall_tier: Tier;
  pod: string;
  seatbelt_off_rate: string;
  signal_violations_rate: string;
  speeding_event_ratio: string;
  swc_ad: string;
  week: number;
  year: number;
  user_id: number;
  user_name: string;
  user_email: string;
}

export interface BelowStandardPerformances {
  cdf: string;
  dcr: string;
  distraction_rate: string;
  driver_amazon_id: string;
  dsb: string;
  fico_score: string;
  following_distance_rate: string;
  id: number;
  performer_status: Tier;
  seatbelt_off_rate: string;
  signal_violations_rate: string;
  speeding_event_ratio: string;
  swc_ad: string;
  swc_cc: string;
  swc_pod: string;
  week: number;
  weeks_fair: number;
  weeks_fantastic: number;
  weeks_great: number;
  weeks_poor: number;
  year: number;
  user_id: number;
  user_name: string;
  user_email: string;
}

export interface SafetyData {
  value: Tier;
  on_road_safety_score: string | null;
  safe_driving_metric: string | null;
  seatbelt_off_rate: string | null;
  speeding_event_rate: string | null;
  sign_violations_rate: string | null;
  distractions_rate: string | null;
  following_distance_rate: string | null;
  breach_of_contract: string | null;
  comprehensive_audit: string | null;
  working_hour_compliance: string | null;
  week: number;
  year: number;
}

export interface QualityData {
  value: Tier;
  customer_delivery_experience: string | null;
  customer_escalation_defect: string | null;
  customer_delivery_feedback: string | null;
  delivery_completion_rate: string | null;
  delivered_and_received: string | null;
  standard_work_compliance: string | null;
  photo_on_delivery: string | null;
  contact_compliance: string | null;
  attended_delivery_accuracy: string | null;
  week: number | null;
  year: number | null;
}

export interface TeamData {
  value: Tier;
  high_performers_share: string | null;
  low_performers_share: string | null;
  tenured_workforce: string | null;
  week: number | null;
  year: number | null;
}

export interface OverallStandingData {
  value: Tier;
  week: number | null;
  year: number | null;
}

export interface DashboardPerformance {
  best_drivers: BestAndWorstPerformances[];
  worst_drivers: BestAndWorstPerformances[];
  below_standard: BelowStandardPerformances[];
  safetys: SafetyData | null;
  qualitys: QualityData | null;
  teams: TeamData | null;
  overall_standings: OverallStandingData | null;
}

export interface LastWeekPerformance {
  id: number;
  fico_score: string | null;
  seatbelt_off_rate: string | null;
  speeding_event_ratio: string | null;
  distraction_rate: string | null;
  following_distance_rate: string | null;
  signal_violations_rate: string | null;
  overall_tier: Tier;
  cdf: string | null;
  dcr: string | null;
  pod: string | null;
  cc: string | null;
  ced: string | null;
  swc_ad: string | null;
  dsb_dnr: string | null;
  cc_o: string | null;
  year: string;
  week: string;
  user_id: number;
  user_name: string;
}

export interface PerformanceUserPeek {
  cc: string;
  cc_o: string;
  cdf: string;
  ced: string;
  dcr: string;
  distraction_rate: string;
  dsb_dnr: string;
  fico_score: string;
  following_distance_rate: string;
  id: number;
  overall_tier: Tier;
  pod: string;
  seatbelt_off_rate: string;
  signal_violations_rate: string;
  speeding_event_ratio: string;
  swc_ad: string;
  week: number;
  year: number;
}

export interface PeekUserPerformance {
  id: number;
  name: string;
  driver_amazon_id: string;
  performances: PerformanceUserPeek[];
}

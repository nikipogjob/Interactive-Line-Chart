import type { Variation, VariationName } from "./variation";

export interface DailyData {
    date: string;
    visits: Record<string, number>;
    conversions: Record<string, number>;
}

export interface TotalData {
    variations: Variation[];
    data: DailyData[];
}

export interface DayPoint {
    'date': string;
    'Original': number | null;
    'Variation A': number | null;
    'Variation B': number | null;
    'Variation C': number | null;
}

export interface VariationsConfig {
    name: VariationName;
}
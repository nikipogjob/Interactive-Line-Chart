import type { Variation } from "./variation";

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
    date: string;
    original: number | null;
    variationA: number | null;
    variationB: number | null;
    variationC: number | null;
}

export type VariationFieldKey = Exclude<keyof DayPoint, 'date'>;

export interface VariationsConfig {
    key: VariationFieldKey;
    name: string;
}
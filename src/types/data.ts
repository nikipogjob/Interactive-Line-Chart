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

export interface VariationPoint {
    'date': string;
    'Original': number | null;
    'Variation A': number | null;
    'Variation B': number | null;
    'Variation C': number | null;
}

export type WeeklySums = Record<VariationName, {
    visits: number;
    conversions: number;
}>;

export type WeekRange = {
    startDate: string;
    endDate: string;
    sums: WeeklySums;
};


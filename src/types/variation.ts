export type VariationId = '0' | '10001' | '10002' | '10003';

export type VariationName = 'Original' | 'Variation A' | 'Variation B' | 'Variation C';

export interface Variation {
    id?: VariationId;
    name: VariationName;
};

export type TimeInterval = 'Week' | 'Day';

export type LineStyle = 'line' | 'smooth' | 'area';


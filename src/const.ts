import type { VariationFieldKey, VariationsConfig } from "./types/data";


export const VariationKeyById: Record<string, VariationFieldKey> = {
    '0': 'original',
    '10001': 'variationA',
    '10002': 'variationB',
    '10003': 'variationC',
} as const;

export const VariationColor: Record<VariationFieldKey, string> = {
    original: '#46464F',
    variationA: '#4142EF',
    variationB: '#FF8346',
    variationC: '#35BDAD',
} as const;


export const variationSeries: VariationsConfig[] = [
    { key: 'original', name: 'Original' },
    { key: 'variationA', name: 'Variation A' },
    { key: 'variationB', name: 'Variation B' },
    { key: 'variationC', name: 'Variation C' },
] as const;

import type { VariationName } from "./types/variation";


export const VariationKeyById: Record<string, VariationName> = {
    '0': 'Original',
    '10001': 'Variation A',
    '10002': 'Variation B',
    '10003': 'Variation C',
} as const;

export const VariationColor: Record<VariationName, string> = {
    Original: '#46464F',
    'Variation A': '#4142EF',
    'Variation B': '#FF8346',
    'Variation C': '#35BDAD',
} as const;



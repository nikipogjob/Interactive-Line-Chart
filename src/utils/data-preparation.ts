import type { DayPoint, TotalData } from "../types/data";
import data from '../data/data.json'
import { VariationKeyById } from "../const";


const chartData = data as unknown as TotalData;

export function getDailyChartPoints(): DayPoint[] {
    return chartData.data.map<DayPoint>((day) => {
        const point: DayPoint = {
            'date': day.date,
            'Original': null,
            'Variation A': null,
            'Variation B': null,
            'Variation C': null,
        };


        Object.entries(VariationKeyById).forEach(([id, key]) => {
            const visits = day.visits[id];
            const conversions = day.conversions[id];

            if (
                typeof visits === "number" &&
                typeof conversions === "number" &&
                visits > 0
            ) {
                point[key] = (conversions / visits) * 100;
            } else {
                point[key] = null;
            }
        });

        return point;
    });
}
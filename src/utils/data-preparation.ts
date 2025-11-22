import type { VariationPoint, TotalData, WeekRange, WeeklySums } from "../types/data";
import data from '../data/data.json'
import { DAYS_IN_A_WEEK, NO_CONVERSIONS, NO_VISITS, VariationKeyById } from "../const";


const chartData = data as unknown as TotalData;

export function getDailyChartPoints(): VariationPoint[] {
    return chartData.data.map<VariationPoint>((day) => {
        const point: VariationPoint = {
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

export function getWeeklyChartPoints(): VariationPoint[] {
    const weeks: WeekRange[] = [];

    chartData.data.forEach((day, index) => {
        const weekIndex = Math.floor(index / DAYS_IN_A_WEEK);

        if (!weeks[weekIndex]) {
            const emptySums: WeeklySums = {} as WeeklySums;

            Object.values(VariationKeyById).forEach((name) => {
                emptySums[name] = { visits: 0, conversions: 0 };
            });

            weeks[weekIndex] = {
                startDate: day.date,
                endDate: day.date,
                sums: emptySums,
            };
        } else {
            weeks[weekIndex].endDate = day.date;
        }

        Object.entries(VariationKeyById).forEach(([id, name]) => {
            const visits = day.visits[id];
            const conversions = day.conversions[id];

            if (typeof visits === "number" && typeof conversions === "number") {
                const bucket = weeks[weekIndex].sums[name];
                bucket.visits += visits;
                bucket.conversions += conversions;
            }
        });
    });

    return weeks.map<VariationPoint>((week, index) => {
        const point: VariationPoint = {
            date: `Week ${index + 1}`,
            'Original': null,
            "Variation A": null,
            "Variation B": null,
            "Variation C": null,
        };

        Object.values(VariationKeyById).forEach((name) => {
            const { visits, conversions } = week.sums[name];

            if (visits > NO_VISITS && conversions > NO_CONVERSIONS) {
                point[name] = (conversions / visits) * 100;
            } else {
                point[name] = null;
            }
        });

        return point;
    });
}

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailyChartPoints, getWeeklyChartPoints } from '../../utils/data-preparation';
import styles from './conversion-chart.module.scss';
import { timeIntervals, VariationColor, VariationKeyById } from '../../const';
import { useState } from 'react';
import type { VariationName, TimeInterval } from '../../types/variation';


export default function ConversionChart() {

    const dailyConversionRates = getDailyChartPoints();
    const weeklyConversionRates = getWeeklyChartPoints();

    const [selectedKeys, setSelectedKeys] = useState<VariationName[]>(
        Object.values(VariationKeyById)
    );

    const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('Day');


    const toggleVariation = (name: VariationName) => {
        setSelectedKeys((prev) => {

            if (prev.includes(name)) {

                if (prev.length === 1) return prev;
                return prev.filter((n) => n !== name);
            }

            return [...prev, name];
        });
    };

    const toggleInterval = (interval: TimeInterval) => {
        setSelectedInterval(interval);
    };


    return (

        <div className={styles.conversionChart}>
            <div className={styles['conversion-chart__controls']}>
                {Object.values(VariationKeyById).map((name) => (
                    <label key={name}>
                        <input
                            type="checkbox"
                            checked={selectedKeys.includes(name)}
                            onChange={() => toggleVariation(name)}
                        />
                        {name}
                    </label>
                ))}
            </div>
            <div className={styles['conversion-chart__controls']}>
                {timeIntervals.map((interval) => (

                    <label key={interval}>
                        <input
                            type="radio"
                            checked={selectedInterval === interval}
                            onChange={() => toggleInterval(interval)}
                        />

                        {interval}
                    </label>
                ))}
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={selectedInterval === 'Day' ? dailyConversionRates : weeklyConversionRates}
                    margin={{ top: 16, right: 16, bottom: 16, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                        unit="%"
                    />
                    <Tooltip
                        formatter={(value: number) => `${value.toFixed(2)}%`}
                    />
                    {Object.values(VariationKeyById)
                        .filter((name) => selectedKeys.includes(name))
                        .map((name) => (
                            <Line
                                key={name}
                                type="monotone"
                                dataKey={name}
                                stroke={VariationColor[name]}
                                dot={false}
                                name={name}
                            />
                        ))}

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
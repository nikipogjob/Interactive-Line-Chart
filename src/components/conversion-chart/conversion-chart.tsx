import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailyChartPoints, getWeeklyChartPoints } from '../../utils/data-preparation';
import styles from './conversion-chart.module.scss';
import { timeIntervals, VariationColor, VariationKeyById } from '../../const';
import { useState } from 'react';
import type { VariationName, TimeInterval } from '../../types/variation';
import { IntervalSelect } from '../interval-select/interval-select';
import { VariationSelect } from '../variation-select/variation-select';
import { ConversionTooltip } from '../conversion-tooltip/conversion-tooltip';


export default function ConversionChart() {

    const dailyConversionRates = getDailyChartPoints();
    const weeklyConversionRates = getWeeklyChartPoints();

    const [selectedVariation, setSelectedVariation] = useState<VariationName[]>(
        Object.values(VariationKeyById)
    );

    const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('Day');

    return (

        <div className={styles['conversion-chart']}>

            <div className={styles['conversion-chart__toolbar']}>
                <div className={styles['conversion-chart__toolbar-left']}>

                    <IntervalSelect
                        value={selectedInterval}
                        options={timeIntervals}
                        onChange={setSelectedInterval}
                    />

                    <VariationSelect
                        value={selectedVariation}
                        options={VariationKeyById}
                        onChange={setSelectedVariation}
                    />
                </div>
                <div className={styles['conversion-chart__toolbar-right']}>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={selectedInterval === 'Day' ? dailyConversionRates : weeklyConversionRates}
                    margin={{ top: 16, right: 16, bottom: 16, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date" />
                    <YAxis
                        unit="%"
                    />
                    <Tooltip
                        content={<ConversionTooltip />}
                        cursor={{ stroke: '#D0D5DD', strokeWidth: 1 }}
                    />
                    {Object.values(VariationKeyById)
                        .filter((name) => selectedVariation.includes(name))
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
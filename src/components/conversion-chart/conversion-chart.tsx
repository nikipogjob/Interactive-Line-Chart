import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailyChartPoints } from '../../utils/data-preparation';
import styles from './conversion-chart.module.scss';
import { VariationColor, variationSeries } from '../../const';


const dailyData = getDailyChartPoints()
console.log(dailyData)

export default function ConversionChart() {
    return (
        <div className={styles.conversionChart}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={dailyData}
                    margin={{ top: 16, right: 16, bottom: 16, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis unit="%" />
                    <Tooltip
                        formatter={(value: number) => `${value.toFixed(2)}%`}
                    />

                    {variationSeries.map(({ key, name }) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={VariationColor[key]}
                            dot={false}
                            name={name}
                        />
                    ))}

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
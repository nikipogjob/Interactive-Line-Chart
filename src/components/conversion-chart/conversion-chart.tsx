import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailyChartPoints } from '../../utils/data-preparation';
import styles from './conversion-chart.module.scss';




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
                    <Line
                        type="monotone"
                        dataKey="original"
                        stroke="#8884d8"
                        dot={false}
                        name='Original'
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
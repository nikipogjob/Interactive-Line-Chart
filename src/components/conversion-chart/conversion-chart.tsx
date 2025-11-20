import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const MOCK_DATA = [
    { date: '2025-01-01', original: 10 },
    { date: '2025-01-02', original: 15 },
    { date: '2025-01-03', original: 8 },
    { date: '2025-01-04', original: 20 },
];

export default function ConversionChart() {
    return (
        <div style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={MOCK_DATA}
                    margin={{ top: 16, right: 16, bottom: 16, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="original"
                        stroke="#8884d8"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
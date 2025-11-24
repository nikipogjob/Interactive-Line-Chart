import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailyChartPoints, getWeeklyChartPoints } from '../../utils/data-preparation';
import styles from './conversion-chart.module.scss';
import { timeIntervals, VariationColor, VariationKeyById } from '../../const';
import { useState } from 'react';
import type { VariationName, TimeInterval } from '../../types/variation';
import { IntervalSelect } from '../interval-select/interval-select';
import { VariationSelect } from '../variation-select/variation-select';
import { ConversionTooltip } from '../conversion-tooltip/conversion-tooltip';
import SelectionIcon from '../icons/selection/selection-icon';
import { MinusIcon } from '../icons/minus/minus-icon';
import { PlusIcon } from '../icons/plus/plus-icon';
import { ResetIcon } from '../icons/reset/reset-icon';
import { DownloadIcon } from '../icons/download/download-icon';
import { LineStyleSelector } from '../line-style-selector/line-style-selector';
import { getCssVar } from '../../utils/utils';
import { MoonIcon } from '../icons/moon/moon-icon';
import { SunIcon } from '../icons/sun/sun-icon';


interface ConversionChartProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}


export default function ConversionChart({ theme, toggleTheme }: ConversionChartProps) {

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
                    <LineStyleSelector />
                    <div className={styles['conversion-chart__icon-group']}>

                        <button
                            type="button"
                            className={styles['toolbar-button']}
                            aria-label="Selection mode"
                        >
                            <SelectionIcon />
                        </button>

                        <div className={styles['zoom-group']}>
                            <button
                                type="button"
                                className={styles['zoom-button'] + ' ' + styles['zoom-button--minus']}
                                aria-label="Zoom out"
                            >
                                <MinusIcon />
                            </button>
                            <button
                                type="button"
                                className={styles['zoom-button'] + ' ' + styles['zoom-button--plus']}
                                aria-label="Zoom in"
                            >
                                <PlusIcon />
                            </button>


                        </div>
                        <button
                            type="button"
                            className={styles['toolbar-button'] + ' ' + styles['toolbar-button--reset']}
                            aria-label="Reset zoom"
                        >
                            <ResetIcon />
                        </button>

                        <button
                            type="button"
                            className={styles['toolbar-button']}
                            aria-label="Export as PNG"
                        >
                            <DownloadIcon />
                        </button>

                        <button
                            type="button"
                            className={styles['toolbar-button']}
                            aria-label="Toggle theme"
                            onClick={toggleTheme}
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles['conversion-chart__chart']}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={selectedInterval === 'Day' ? dailyConversionRates : weeklyConversionRates}
                        margin={{ top: 16, right: 16, bottom: 16, left: 0 }}
                    >
                        <CartesianGrid stroke={getCssVar('--chart-grid')} />
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
        </div>
    );
}
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import { getDailyChartPoints, getWeeklyChartPoints } from '../../utils/data-preparation';
import styles from './conversion-chart.module.scss';
import { lineStyles, MIN_ZOOM_POINTS, timeIntervals, VariationColor, VariationKeyById, ZOOM_STEP_RATIO } from '../../const';
import { useMemo, useRef, useState } from 'react';
import type { VariationName, TimeInterval, LineStyle } from '../../types/variation';
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

    const chartWrapperRef = useRef<HTMLDivElement | null>(null);

    const [selectedVariation, setSelectedVariation] = useState<VariationName[]>(
        Object.values(VariationKeyById)
    );

    const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('Day');

    const [zoomRange, setZoomRange] = useState<[number, number] | null>(null);

    const [lineStyle, setLineStyle] = useState<LineStyle>('line');

    const renderedLines = useMemo(() => {
        return Object.values(VariationKeyById)
            .filter(name => selectedVariation.includes(name))
            .map(name =>
                lineStyle === 'area' ? (
                    <Area
                        key={name}
                        type="monotone"
                        dataKey={name}
                        stroke={VariationColor[name]}
                        fill={VariationColor[name]}
                        fillOpacity={0.16}
                        name={name}
                    />
                ) : (
                    <Line
                        key={name}
                        type={lineStyle === 'smooth' ? 'monotone' : 'linear'}
                        dataKey={name}
                        stroke={VariationColor[name]}
                        dot={false}
                        strokeWidth={2}
                        name={name}
                    />
                )
            );
    }, [selectedVariation, lineStyle]);

    const baseData = selectedInterval === 'Day'
        ? dailyConversionRates
        : weeklyConversionRates;


    const handleZoomReset = () => setZoomRange(null);


    const handleZoomIn = () => {
        const length = baseData.length;
        if (!length) return;

        const [start, end] = zoomRange ?? [0, length - 1];
        const current = end - start + 1;

        if (current <= MIN_ZOOM_POINTS) return;

        const step = Math.max(1, Math.round(current * ZOOM_STEP_RATIO));
        const newStart = start + step;
        const newEnd = end - step;

        if (newStart >= newEnd) return;

        setZoomRange([newStart, newEnd]);
    };

    const handleZoomOut = () => {
        const length = baseData.length;
        if (!length) return;

        const [start, end] = zoomRange ?? [0, length - 1];

        const step = Math.max(1, Math.round(length * ZOOM_STEP_RATIO));
        const newStart = Math.max(0, start - step);
        const newEnd = Math.min(length - 1, end + step);

        if (newStart === start && newEnd === end) {
            setZoomRange(null);
        } else {
            setZoomRange([newStart, newEnd]);
        }
    };

    const visibleData = zoomRange
        ? baseData.slice(zoomRange[0], zoomRange[1] + 1)
        : baseData;



    const handleIntervalChange = (value: TimeInterval) => {
        setSelectedInterval(value);
        setZoomRange(null);
    };

    const handleVariationChange = (value: VariationName[]) => {
        setSelectedVariation(value);
        setZoomRange(null);
    };

    const handleExportPng = () => {
        const wrapper = chartWrapperRef.current;
        if (!wrapper) return;

        const svg = wrapper.querySelector('.recharts-surface') as SVGSVGElement | null;
        if (!svg) return;

        const { width, height } = svg.getBoundingClientRect();
        if (!width || !height) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        const svgBlob = new Blob([svgString], {
            type: 'image/svg+xml;charset=utf-8',
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(svgUrl);

            canvas.toBlob((blob) => {
                if (!blob) return;

                const pngUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = pngUrl;
                link.download = 'conversion-chart.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(pngUrl);
            }, 'image/png');
        };

        img.onerror = () => {
            URL.revokeObjectURL(svgUrl);
        };

        img.src = svgUrl;
    };


    return (

        <div
            className={styles['conversion-chart']}

        >

            <div className={styles['conversion-chart__toolbar']}>
                <div className={styles['conversion-chart__toolbar-left']}>

                    <IntervalSelect
                        value={selectedInterval}
                        options={timeIntervals}
                        onChange={handleIntervalChange}
                    />

                    <VariationSelect
                        value={selectedVariation}
                        options={VariationKeyById}
                        onChange={handleVariationChange}
                    />
                </div>
                <div className={styles['conversion-chart__toolbar-right']}>
                    <LineStyleSelector
                        options={lineStyles}
                        value={lineStyle}
                        onChange={setLineStyle}
                    />
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
                                onClick={handleZoomOut}
                            >
                                <MinusIcon />
                            </button>
                            <button
                                type="button"
                                className={styles['zoom-button'] + ' ' + styles['zoom-button--plus']}
                                aria-label="Zoom in"
                                onClick={handleZoomIn}
                            >
                                <PlusIcon />
                            </button>


                        </div>
                        <button
                            type="button"
                            className={styles['toolbar-button'] + ' ' + styles['toolbar-button--reset']}
                            aria-label="Reset zoom"
                            onClick={handleZoomReset}
                        >
                            <ResetIcon />
                        </button>

                        <button
                            type="button"
                            className={styles['toolbar-button']}
                            aria-label="Export as PNG"
                            onClick={handleExportPng}
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
            <div
                className={styles['conversion-chart__chart']}
                ref={chartWrapperRef}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={visibleData}
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
                        {renderedLines}

                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
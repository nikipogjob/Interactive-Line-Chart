import type { ValueType, NameType, Payload } from 'recharts/types/component/DefaultTooltipContent';
import styles from './conversion-tooltip.module.scss';
import { CalendarIcon } from '../icons/calendar-icon/calendar-icon';
import WinnerIcon from '../icons/winner-icon/winner-icon';


type ConversionTooltipProps = {
    active?: boolean;
    label?: string | number;
    payload?: Payload<ValueType, NameType>[];
};


function formatTooltipLabel(raw: string | number): string {
    if (typeof raw !== 'string') return String(raw);
    if (raw.startsWith("Week")) return raw;

    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    return raw;
}

export function ConversionTooltip({ active, label, payload }: ConversionTooltipProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const points = payload.filter(
        (item): item is Payload<ValueType, NameType> & { value: number } =>
            typeof item.value === 'number'
    );

    const sortedPoints = [...points].sort(
        (a, b) => Number(b.value) - Number(a.value)
    );

    const maxValue = Number(sortedPoints[0]?.value ?? 0);

    return (
        <div className={styles['conversion-tooltip']}>
            <div className={styles['conversion-tooltip__header']}>
                <CalendarIcon />
                <span className={styles['conversion-tooltip__date']}>
                    {formatTooltipLabel(label!)}
                </span>
            </div>

            <div className={styles['conversion-tooltip__list']}>
                {sortedPoints.map((item) => {
                    const value = Number(item.value ?? 0);
                    const isWinner = value === maxValue;

                    return (
                        <div
                            key={item.name}
                            className={styles['conversion-tooltip__row']}
                        >
                            <div className={styles['conversion-tooltip__row-left']}>
                                <span
                                    className={styles['conversion-tooltip__dot']}
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className={styles['conversion-tooltip__name']}>
                                    {item.name}
                                </span>
                                {isWinner && (
                                    <WinnerIcon />
                                )}
                            </div>

                            <div className={styles['conversion-tooltip__value']}>
                                {value.toFixed(2)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

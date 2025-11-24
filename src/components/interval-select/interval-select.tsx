import { useState, useRef, useEffect } from 'react';
import type { TimeInterval } from '../../types/variation';
import styles from './interval-select.module.scss';
import { ChevronIcon } from '../icons/chevron/chevron-icon';

interface IntervalSelectProps {
    value: TimeInterval;
    options: TimeInterval[];
    onChange: (value: TimeInterval) => void;
}

export function IntervalSelect({ value, options, onChange }: IntervalSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (option: TimeInterval) => {
        if (option !== value) {
            onChange(option);
        }
        setIsOpen(false);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={styles['interval-select']} ref={rootRef}>
            <button
                type="button"
                className={styles['interval-select__button']}
                onClick={toggleOpen}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={styles['interval-select__label']}>{value}</span>
                <ChevronIcon
                    direction={isOpen ? 'up' : 'down'}
                    className={styles['interval-select__icon']}
                    aria-hidden="true"
                />

            </button>

            {isOpen && (
                <div className={styles['interval-select__menu']} role="listbox">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={
                                option === value
                                    ? styles['interval-select__option--active']
                                    : styles['interval-select__option']
                            }
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

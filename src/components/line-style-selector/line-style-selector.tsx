import { useEffect, useRef, useState } from 'react';
import styles from './line-style-selector.module.scss';
import type { LineStyle } from '../../types/variation';
import { ChevronIcon } from '../icons/chevron/chevron-icon';

interface LineStyleSelectorProps {
    value: LineStyle;
    options: LineStyle[];
    onChange: (value: LineStyle) => void;
}


export function LineStyleSelector({ value, options, onChange }: LineStyleSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (option: LineStyle) => {
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
        <div
            className={styles['line-style-selector']}
            ref={rootRef}
        >
            <button
                type='button'
                className={styles['line-style-selector__button']}
                aria-haspopup='listbox'
                aria-expanded={isOpen}
                onClick={toggleOpen}
            >
                <span className={styles['line-style-selector__label']}>
                    {`Line style: ${value}`}
                </span>
                <ChevronIcon
                    direction={isOpen ? 'up' : 'down'}
                    className={styles['line-style-selector__icon']}
                    aria-hidden="true"
                />
            </button>
            {isOpen && (
                <div className={styles['line-style-selector__menu']} role="listbox">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={
                                option === value
                                    ? styles['line-style-selector__option--active']
                                    : styles['line-style-selector__option']
                            }
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
};

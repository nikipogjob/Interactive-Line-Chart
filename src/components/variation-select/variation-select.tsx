import styles from "./variation-select.module.scss";
import { useEffect, useRef, useState } from "react";
import type { VariationName } from "../../types/variation";
import { ChevronIcon } from "../icons/chevron/chevron-icon";

interface VariationSelectProps {
    value: VariationName[];
    options: Record<string, VariationName>;
    onChange: (value: VariationName[]) => void;
}

export function VariationSelect({ value, options, onChange }: VariationSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleVariation = (name: VariationName) => {
        const isSelected = value.includes(name);

        if (isSelected) {

            if (value.length === 1) return;
            onChange(value.filter((n) => n !== name));
            return;
        }

        onChange([...value, name]);

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
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen]);

    const totalCount = Object.values(options).length;
    const allSelected = value.length === totalCount;

    const plural = new Intl.PluralRules("en-US").select(value.length);

    const labelText =
        allSelected
            ? 'All variations selected'
            : `${value.length} ${plural === 'one' ? 'variation' : 'variations'} selected`;

    return (
        <div
            className={styles['variation-select']}
            ref={rootRef}
        >
            <button
                type='button'
                className={styles['variation-select__button']}
                onClick={toggleOpen}
                aria-haspopup='listbox'
                aria-expanded={isOpen}
            >
                <span className={styles['variation-select__label']}>
                    {labelText}
                </span>
                <ChevronIcon
                    direction={isOpen ? 'up' : 'down'}
                    className={styles['variation-select__icon']}
                    aria-hidden="true"
                />

            </button>
            {isOpen && (
                <div
                    className={styles['variation-select__menu']}
                    role="listbox"
                >
                    {Object.values(options).map((name) => (
                        <label
                            key={name}
                            className={styles["variation-select__option"]}
                        >
                            <input
                                type="checkbox"
                                checked={value.includes(name)}
                                onChange={() => toggleVariation(name)}
                            />
                            <span className={styles["variation-select__option-label"]}>
                                {name}
                            </span>
                        </label>
                    ))}
                </div>
            )}


        </div>
    )
};

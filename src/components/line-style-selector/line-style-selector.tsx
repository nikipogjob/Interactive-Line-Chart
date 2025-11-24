import styles from './line-style-selector.module.scss';

export function LineStyleSelector() {
    return (
        <div
            className={styles['line-style-selector']}
        >
            <button
                type='button'
                className={styles['line-style-selector__button']}
                aria-haspopup='listbox'
            >
                <span className={styles['line-style-selector__label']}>
                    Line style: smooth
                </span>
            </button>
        </div>
    )
};

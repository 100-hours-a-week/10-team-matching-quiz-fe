import styles from './styles.module.scss'

interface ClickableTagProps {
  label: string
  selected: boolean
  onClick: () => void
  disabled: boolean
}

export const ClickableTag: React.FC<ClickableTagProps> = ({
  label,
  selected,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${styles.tag} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
  >
    <span>{label}</span>
    <span className={styles.icon}>{selected ? '✓' : '+'}</span>
  </button>
)

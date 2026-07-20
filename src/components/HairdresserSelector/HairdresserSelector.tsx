import type { Hairdresser } from "../../interface/interface";
import styles from "./styles.module.css";

interface Props {
  hairdressers: Hairdresser[];
  selectedId: string | null;
  onSelect: (hairdresser: Hairdresser) => void;
  brandColor: string;
}

export function HairdresserSelector({
  hairdressers,
  selectedId,
  onSelect,
  brandColor,
}: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Выберите мастера</h2>
      <div className={styles.list}>
        {hairdressers.map((h) => (
          <button
            key={h.id}
            className={`${styles.item} ${selectedId === h.id ? styles.selected : ""}`}
            onClick={() => onSelect(h)}
            style={selectedId === h.id ? { borderColor: brandColor } : undefined}
          >
            <div className={styles.avatar}>
              {h.username.charAt(0).toUpperCase()}
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{h.username}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

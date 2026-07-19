import type { Service } from "../../interface/interface";
import styles from "./styles.module.css";

interface Props {
  services: Service[];
  selectedId: number | null;
  onSelect: (service: Service) => void;
  brandColor: string;
}

export function ServiceSelector({ services, selectedId, onSelect, brandColor }: Props) {
  const mens = services.filter((s) =>
    ["Мужская стрижка", "Стрижка под насадку", "Оформление бороды"].includes(s.serviceName) ||
    s.serviceName.includes("усов") ||
    s.serviceName.includes("Пилинг") ||
    s.serviceName === "Мытье головы" ||
    s.serviceName === "Александровская скидка"
  );
  const womens = services.filter((s) => !mens.includes(s));

  const renderGroup = (title: string, list: Service[]) => {
    if (list.length === 0) return null;
    return (
      <div className={styles.group}>
        <h3 className={styles.groupTitle}>{title}</h3>
        {list.map((s) => (
          <button
            key={s.id}
            className={`${styles.item} ${selectedId === s.id ? styles.selected : ""}`}
            onClick={() => onSelect(s)}
            style={selectedId === s.id ? { borderColor: brandColor } : undefined}
          >
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{s.serviceName}</span>
              {s.durationMinutes > 0 && (
                <span className={styles.itemDuration}>{s.durationMinutes} мин</span>
              )}
            </div>
            <span className={styles.itemPrice} style={{ color: brandColor }}>
              {s.price} ₽
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Выберите услугу</h2>
      {renderGroup("Мужские услуги", mens)}
      {renderGroup("Женские услуги", womens)}
    </div>
  );
}

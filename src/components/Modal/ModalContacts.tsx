import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

interface WorkSchedule {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  color: string;
  phone: string;
  address: string;
  link?: string;
  workSchedule: WorkSchedule;
}

const dayLabels: Record<keyof WorkSchedule, string> = {
  monday: "Понедельник",
  tuesday: "Вторник",
  wednesday: "Среда",
  thursday: "Четверг",
  friday: "Пятница",
  saturday: "Суббота",
  sunday: "Воскресенье",
};

const ModalContacts = ({
  isOpen,
  onClose,
  name,
  color,
  phone,
  address,
  link,
  workSchedule,
}: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const days = Object.keys(workSchedule) as (keyof WorkSchedule)[];

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `4px solid ${color}` }}
      >
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 24, fontWeight: 700 }}>
          {name}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <strong>Телефон:</strong>{" "}
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} style={{ color: "inherit" }}>
              {phone}
            </a>
          </div>
          <div>
            <strong>Адрес:</strong> {address}
          </div>
          {link && (
            <div>
              <strong>Сообщество:</strong>{" "}
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </div>
          )}
        </div>

        <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: 18, fontWeight: 600 }}>
          График работы
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 16px",
            fontSize: 14,
          }}
        >
          {days.map((day) => (
            <div key={day} style={{ display: "contents" }}>
              <span style={{ color: "var(--text-secondary)" }}>{dayLabels[day]}</span>
              <span>{workSchedule[day]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalContacts;

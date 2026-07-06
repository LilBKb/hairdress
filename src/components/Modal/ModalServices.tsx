import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { priceListType } from "../../interface/interface";
import styles from "./styles.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  color: string;
  priceList: priceListType[];
}

const typeLabels: Record<string, string> = {
  Мужская: "Мужские услуги",
  Женская: "Женские услуги",
};

const ModalServices = ({ isOpen, onClose, name, color, priceList }: Props) => {
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

  const grouped = priceList.reduce<Record<string, priceListType[]>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

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

        {Object.entries(grouped).map(([type, services]) => (
          <div key={type} style={{ marginBottom: 20 }}>
            <h3
              style={{
                marginTop: 0,
                marginBottom: 12,
                fontSize: 18,
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              {typeLabels[type] || type}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {services.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    fontSize: 14,
                    lineHeight: 1.4,
                  }}
                >
                  <span>{item.service}</span>
                  <span style={{ whiteSpace: "nowrap", fontWeight: 600, color: color }}>
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default ModalServices;

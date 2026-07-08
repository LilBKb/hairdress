import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contact: string;
  loading: boolean;
  error?: string | null;
  onConfirm: (code: string) => void;
}

const ModalCode = ({ isOpen, onClose, contact, loading, error, onConfirm }: Props) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCode("");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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

  const handleSubmit = () => {
    if (code.trim()) onConfirm(code.trim());
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.title}>Код подтверждения</h2>
        <p className={styles.subtitle}>
          Код отправлен на <strong>{contact}</strong>
        </p>

        <div className={styles.field}>
          <label className={styles.label}>Введите код</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.input}
            placeholder="xxxxxx"
            autoFocus
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading || !code.trim()} className={styles.button}>
          {loading ? "Проверка..." : "Подтвердить"}
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ModalCode;

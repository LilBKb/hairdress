import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, approveCode, verifyEmail, clearError } from "../../store/slices/userSlice";
import { Link, Navigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import ModalCode from "../../components/ModalCode/ModalCode";
import styles from "./styles.module.css";

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const { token, loading, error } = useAppSelector((state) => state.user);

  const [contact, setContact] = useState("");
  const [operationId, setOperationId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const isEmail = contact.includes("@");

  const handleSendCode = async () => {
    if (!contact.trim()) {
      setLocalError("Введите email или номер телефона");
      return;
    }
    setLocalError(null);
    dispatch(clearError());

    const data = isEmail ? { email: contact } : { phone_number: contact };
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      if (result.payload.operation_id) {
        setOperationId(result.payload.operation_id);
        setCodeModalOpen(true);
      }
    } else {
      setLocalError("Пользователь не найден");
    }
  };

  const handleConfirmCode = async (code: string) => {
    if (!operationId) return;

    const data = isEmail
      ? { email: contact, code, operation_id: operationId }
      : { phone_number: contact, code, operation_id: operationId };

    const approved = await dispatch(approveCode(data));
    if (!approveCode.fulfilled.match(approved)) return;

    const verified = await dispatch(verifyEmail(approved.payload.token));
    if (verifyEmail.fulfilled.match(verified)) {
      setCodeModalOpen(false);
    }
  };

  return (
    <div className={styles.page}>
      <BackButton />
      <div className={styles.container}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.subtitle}>Войдите по коду из email или SMS</p>
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email или телефон</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              required
              className={styles.input}
              placeholder="example@mail.com / +7 (999) 123-45-67"
            />
          </div>
          {(error || localError) && <p className={styles.error}>{localError || error}</p>}
          <button onClick={handleSendCode} disabled={loading} className={styles.button}>
            {loading ? "Отправка..." : "Получить код"}
          </button>
        </div>
        <p className={styles.link}>
          Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
        </p>
      </div>

      <ModalCode
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        contact={contact}
        loading={loading}
        error={error}
        onConfirm={handleConfirmCode}
      />
    </div>
  );
};

export default AuthPage;

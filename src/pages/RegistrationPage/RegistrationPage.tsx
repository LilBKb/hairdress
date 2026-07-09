import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, requestEmailCode, approveCode, verifyEmail, clearError } from "../../store/slices/userSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import ModalCode from "../../components/ModalCode/ModalCode";
import styles from "./styles.module.css";

type ContactType = "email" | "phone";

const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useAppSelector((state) => state.user);

  const [contactType, setContactType] = useState<ContactType>("email");
  const [contactValue, setContactValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [operationId, setOperationId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async () => {
    if (!contactValue.trim()) {
      setLocalError(contactType === "email" ? "Введите email" : "Введите номер телефона");
      return;
    }
    if (!fullName.trim()) {
      setLocalError("Введите имя");
      return;
    }
    setLocalError(null);
    dispatch(clearError());

    const username = contactType === "email"
      ? contactValue.split("@")[0]
      : fullName.replace(/\s+/g, "_");

    const result = await dispatch(registerUser({
      username,
      full_name: fullName,
      phone_number: contactType === "phone" ? contactValue : "",
    }));

    if (registerUser.fulfilled.match(result)) {
      if (contactType === "email") {
        if (result.payload.operation_id) {
          setOperationId(result.payload.operation_id);
        } else {
          const codeRes = await dispatch(requestEmailCode(contactValue));
          if (requestEmailCode.fulfilled.match(codeRes)) {
            setOperationId(codeRes.payload.operation_id);
          }
        }
        setCodeModalOpen(true);
      } else {
        navigate("/");
      }
    }
  };

  const handleConfirmCode = async (code: string) => {
    if (!operationId || contactType !== "email") return;

    const approved = await dispatch(approveCode({ email: contactValue, code, operation_id: operationId }));
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
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>Создайте аккаунт по коду из email или SMS</p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${contactType === "email" ? styles.tabActive : ""}`}
            onClick={() => setContactType("email")}
          >
            Email
          </button>
          <button
            className={`${styles.tab} ${contactType === "phone" ? styles.tabActive : ""}`}
            onClick={() => setContactType("phone")}
          >
            Телефон
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Имя</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              required
              className={styles.input}
              placeholder="Иван Иванов"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{contactType === "email" ? "Email" : "Номер телефона"}</label>
            <input
              type={contactType === "email" ? "email" : "tel"}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              required
              className={styles.input}
              placeholder={contactType === "email" ? "example@mail.com" : "+7 (999) 123-45-67"}
            />
          </div>
          {(error || localError) && <p className={styles.error}>{localError || error}</p>}
          <button onClick={handleRegister} disabled={loading} className={styles.button}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </div>
        <p className={styles.link}>
          Уже есть аккаунт? <Link to="/auth">Войти</Link>
        </p>
      </div>

      <ModalCode
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        contact={contactValue}
        loading={loading}
        error={error}
        onConfirm={handleConfirmCode}
      />
    </div>
  );
};

export default RegistrationPage;

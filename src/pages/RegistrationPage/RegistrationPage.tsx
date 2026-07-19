import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import BackButton from "../../components/BackButton/BackButton"
import ModalCode from "../../components/ModalCode/ModalCode"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { approveCode, clearError, loginEmail, registerUser, requestEmailCode } from "../../store/slices/userSlice"
import styles from "./styles.module.css"

const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const { token, loading, error } = useAppSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [operationId, setOperationId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async () => {
    if (!email.trim()) {
      setLocalError("Введите email");
      return;
    }
    if (!phoneNumber.trim()) {
      setLocalError("Введите номер телефона");
      return;
    }
    if (!fullName.trim()) {
      setLocalError("Введите имя");
      return;
    }
    setLocalError(null);
    dispatch(clearError());

    const username = email.split("@")[0];

    const result = await dispatch(registerUser({
      username,
      email,
      phone_number: phoneNumber,
    }));

    if (registerUser.fulfilled.match(result)) {
      if (result.payload.operation_id) {
        setOperationId(result.payload.operation_id);
      } else {
        const codeRes = await dispatch(requestEmailCode(email));
        if (requestEmailCode.fulfilled.match(codeRes)) {
          setOperationId(codeRes.payload.operation_id);
        } else {
          if (requestEmailCode.rejected.match(codeRes)) {
            const errorMsg = typeof codeRes.payload === 'string' ? codeRes.payload : null;
            if (errorMsg) setLocalError(errorMsg);
          }
        }
      }
      setCodeModalOpen(true);
    } else {
      if (registerUser.rejected.match(result)) {
        const errorMsg = typeof result.payload === 'string' ? result.payload : null;
        if (errorMsg) setLocalError(errorMsg);
      }
    }
  };

  const handleConfirmCode = async (code: string) => {
    if (!operationId) return;

    const approved = await dispatch(approveCode({ email, code, operation_id: operationId }));
    if (!approveCode.fulfilled.match(approved)) return;

    console.log("token", approved.payload.token);

    const verified = await dispatch(loginEmail(approved.payload.token ?? ""));
    if (loginEmail.fulfilled.match(verified)) {
      setCodeModalOpen(false);
    }
  };

  return (
    <div className={styles.page}>
      <BackButton />
      <div className={styles.container}>
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>Создайте аккаунт по коду из email или SMS</p>

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
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              required
              className={styles.input}
              placeholder="example@mail.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Номер телефона</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              required
              className={styles.input}
              placeholder="+7 (999) 123-45-67"
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
        contact={email}
        loading={loading}
        error={error}
        onConfirm={handleConfirmCode}
      />
    </div>
  );
};

export default RegistrationPage;

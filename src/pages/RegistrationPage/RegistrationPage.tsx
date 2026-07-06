import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, clearError } from "../../store/slices/userSlice";
import { authApi } from "../../api/authApi";
import { Link, Navigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import styles from "./styles.module.css";

type Step = "form" | "verify";

const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const { token, loading, error } = useAppSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>("form");

  const [operationId, setOperationId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);

  if (token && !verified) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setLocalError("Пароль должен быть не менее 6 символов");
      return;
    }

    const result = await dispatch(registerUser({ username, password, full_name: fullName, phone_number: phoneNumber }));
    if (registerUser.fulfilled.match(result)) {
      setStep("verify");
    }
  };

  const handleSendCode = async () => {
    if (!email) {
      setLocalError("Введите email для верификации");
      return;
    }
    setVerifyLoading(true);
    setLocalError(null);
    try {
      const res = await authApi.requestEmailVerification({ email });
      setOperationId(res.operation_id);
      setCodeSent(true);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Ошибка отправки кода");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || !operationId) return;
    setVerifyLoading(true);
    setLocalError(null);
    try {
      const res = await authApi.approveCode({ email, code, operation_id: operationId });
      await authApi.verifyEmail(res.token);
      setVerified(true);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Неверный код");
    } finally {
      setVerifyLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className={styles.page}>
        <BackButton />
        <div className={styles.container}>
          <h1 className={styles.title}>Подтверждение email</h1>
          <p className={styles.subtitle}>Подтвердите ваш email, чтобы завершить регистрацию</p>
          <div className={styles.form}>
            {!codeSent ? (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="example@mail.com"
                  />
                </div>
                {localError && <p className={styles.error}>{localError}</p>}
                <button onClick={handleSendCode} disabled={verifyLoading} className={styles.button}>
                  {verifyLoading ? "Отправка..." : "Отправить код"}
                </button>
              </>
            ) : (
              <>
                <p className={styles.subtitle}>Код отправлен на {email}</p>
                <div className={styles.field}>
                  <label className={styles.label}>Код подтверждения</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={styles.input}
                    placeholder="Введите код"
                  />
                </div>
                {localError && <p className={styles.error}>{localError}</p>}
                <button onClick={handleVerifyCode} disabled={verifyLoading} className={styles.button}>
                  {verifyLoading ? "Проверка..." : "Подтвердить"}
                </button>
              </>
            )}
            {verified && (
              <div>
                <p className={styles.success}>Email подтверждён!</p>
                <Link to="/" className={styles.button}>На главную</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <BackButton />
      <div className={styles.container}>
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>Создайте новый аккаунт</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              required
              className={styles.input}
              placeholder="Введите имя"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Полное имя</label>
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
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              className={styles.input}
              placeholder="example@mail.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              required
              className={styles.input}
              placeholder="Придумайте пароль"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Подтвердите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => { dispatch(clearError()); setLocalError(null); }}
              required
              className={styles.input}
              placeholder="Повторите пароль"
            />
          </div>
          {(error || localError) && <p className={styles.error}>{localError || error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className={styles.link}>
          Уже есть аккаунт? <Link to="/auth">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;

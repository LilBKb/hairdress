import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, clearError } from "../../store/slices/userSlice";
import { Link, Navigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import styles from "./styles.module.css";

const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const { token, loading, error } = useAppSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ username, password, fullName, phoneNumber }));
  };

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
              onFocus={() => dispatch(clearError())}
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
              onFocus={() => dispatch(clearError())}
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
              onFocus={() => dispatch(clearError())}
              required
              className={styles.input}
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => dispatch(clearError())}
              required
              className={styles.input}
              placeholder="Придумайте пароль"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
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

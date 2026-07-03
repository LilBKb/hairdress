import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { registerUser, clearError } from '../../store/slices/userSlice'
import { Link, Navigate } from 'react-router-dom'
import styles from './styles.module.css'

const RegistrationPage = () => {
  const dispatch = useAppDispatch()
  const { token, loading, error } = useAppSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  if (token) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(registerUser({ username, password, fullName, phoneNumber }))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Регистрация</h1>
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
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className={styles.link}>
        Уже есть аккаунт? <Link to="/auth">Войти</Link>
      </p>
    </div>
  )
}

export default RegistrationPage

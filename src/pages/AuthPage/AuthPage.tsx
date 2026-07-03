import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loginUser, clearError } from '../../store/slices/userSlice'
import { Link, Navigate } from 'react-router-dom'
import styles from './styles.module.css'

const AuthPage = () => {
  const dispatch = useAppDispatch()
  const { token, loading, error } = useAppSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (token) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginUser({ username, password }))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Авторизация</h1>
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
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
      <p className={styles.link}>
        Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
      </p>
    </div>
  )
}

export default AuthPage

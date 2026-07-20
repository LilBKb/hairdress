import type { AxiosError } from 'axios'

interface GrpcErrorResponse {
  error?: string
  message?: string
  code?: number
}

const domainMessages: Record<string, string> = {
  'user not found': 'Пользователь не найден',
  'username already exists': 'Имя пользователя уже занято',
  'phone already exists': 'Телефон уже зарегистрирован',
  'forbidden': 'Доступ запрещён',
  'invalid code': 'Неверный код',
  'code expired': 'Код истёк, запросите новый',
  'too many attempts': 'Слишком много попыток',
  'verify rate limited': 'Слишком много попыток, попробуйте позже',
  'session is blocked': 'Сессия заблокирована',
  'verify cooldown': 'Подождите перед повторной отправкой',
  'invalid token': 'Недействительный токен',
  'user not verified': 'Пользователь не верифицирован',
  'redis not found': 'Код не найден или истёк',
  'auth temporally blocked': 'Авторизация временно заблокирована',
  'sms code expired': 'Код истёк, запросите новый',
  'invalid credentials': 'Неверные учётные данные',
  'record not found': 'Запись не найдена',
  'refresh token is expired': 'Сессия истекла, войдите снова',
  'device mistake': 'Ошибка устройства',
  'invalid request method': 'Некорректный запрос',
  'out of daily limits': 'Превышен дневной лимит',
  'out of daily limits for ip address': 'Превышен дневной лимит',
  'internal server error': 'Внутренняя ошибка сервера',
}

function extractErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<GrpcErrorResponse>
  const body = axiosError.response?.data
  if (body?.message) return body.message
  if (body?.error) return body.error
  if (axiosError.message) return axiosError.message
  return ''
}

export function mapApiError(error: unknown, fallback: string): string {
  const raw = extractErrorMessage(error).trim()
  const message = raw.toLowerCase()

  if (message.includes('auth temporally blocked')) {
    const parts = message.split(/[:.]\s*/)
    const seconds = parts[1]
    if (seconds) {
      const sec = Math.ceil(Number(seconds))
      const m = Math.floor(sec / 60)
      const s = sec % 60
      if (m > 0) return `Авторизация временно заблокирована. Подождите ${m} мин ${s} сек`
      return `Авторизация временно заблокирована. Подождите ${sec} сек`
    }
    return 'Авторизация временно заблокирована'
  }

  for (const [key, msg] of Object.entries(domainMessages)) {
    if (message.includes(key)) return msg
  }

  return fallback
}
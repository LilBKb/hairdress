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
  'sms rate limited': 'Слишком много попыток, попробуйте позже',
  'session is blocked': 'Сессия заблокирована',
  'sms cooldown': 'Подождите перед повторной отправкой',
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
  'daily limits exceeded': 'Превышен дневной лимит',
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
  const message = extractErrorMessage(error).trim().toLowerCase()

  for (const [key, msg] of Object.entries(domainMessages)) {
    if (message.includes(key)) return msg
  }

  return fallback
}
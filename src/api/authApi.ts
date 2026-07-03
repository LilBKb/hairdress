const API_BASE = 'http://localhost:3000/api'

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  user: {
    username: string;
    fullName: string;
    phoneNumber: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка запроса' }))
    throw new Error(error.message || 'Ошибка запроса')
  }

  return response.json()
}

export const authApi = {
  register: (data: RegisterRequest) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () =>
    request<AuthResponse['user']>('/auth/me'),
}

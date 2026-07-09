import { apiClient } from './client'

const authApiPath = '/api/v1/auth/'

export interface User {
  username: string;
  full_name: string;
  phone_number: string;
  email: string;
  role: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username?: string;
  phone_number?: string;
  email?: string;
}

export interface RegisterRequest {
  username: string;
  full_name: string;
  phone_number: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  operation_id?: string;
}

export interface GetMeResponse {
  user: User;
}

export interface RequestEmailVerificationRequest {
  email: string;
  operation_id?: string;
}

export interface ApproveCodeRequest {
  phone_number?: string;
  email?: string;
  code: string;
  operation_id: string;
}

export interface VerifyEmailResponse {
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post(authApiPath+'register', data)
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post(authApiPath+'login', data)
    return res.data;
  },

  getMe: async (): Promise<GetMeResponse> => {
    const res = await apiClient.get(authApiPath+'me')
    return res.data;
  },

  requestEmailVerification: async (data: RequestEmailVerificationRequest): Promise<{ operation_id: string }> => {
    const res = await apiClient.post(authApiPath+'request-email-verification', data)
    return res.data;
  },

  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const res = await apiClient.post(authApiPath+'verify-email', { token })
    return res.data;
  },

  approveCode: async (data: ApproveCodeRequest): Promise<{ token: string }> => {
    const res = await apiClient.post(authApiPath+'approve-code', data)
    return res.data;
  },
}

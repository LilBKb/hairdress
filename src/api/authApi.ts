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

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  operation_id?: string;
}

export interface GetMeResponse {
  user: User;
}

export interface RequestCodeRequest {
  email?: string;
  phone_number?: string;
}

export interface LoginWithCodeRequest {
  email?: string;
  phone_number?: string;
  code: string;
  operation_id: string;
}

export const authApi = {
  getMe: async (): Promise<GetMeResponse> => {
    const res = await apiClient.get(authApiPath+'me')
    return res.data;
  },

  requestCode: async (data: RequestCodeRequest): Promise<{ operation_id: string }> => {
    const res = await apiClient.post(authApiPath+'request-code', data)
    return res.data;
  },

  loginWithCode: async (data: LoginWithCodeRequest): Promise<AuthResponse> => {
    const res = await apiClient.post(authApiPath+'login-with-code', data)
    return res.data;
  },
}

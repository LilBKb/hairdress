import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { authApi, type LoginRequest, type RegisterRequest } from '../../api/authApi'
import { mapApiError } from '../../api/errorMapper'
import type { User } from '../../interface/interface'
import { tokenStorage } from '../token/tokenStorage'

function mapUser(u: { username: string; full_name: string; phone_number: string; email: string; role: string; is_verified: boolean; created_at: string; updated_at: string }): User {
  return {
    username: u.username,
    fullName: u.full_name,
    phoneNumber: u.phone_number,
    email: u.email,
    role: u.role,
    isVerified: u.is_verified,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  }
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: tokenStorage.getAccessToken(),
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data)
      if (response.access_token) {
        tokenStorage.setTokens(response.access_token, response.refresh_token)
      }
      return {
        token: response.access_token || null,
        user: response.user ? mapUser(response.user) : null,
        operation_id: response.operation_id || null,
      }
    } catch (error) {
      return rejectWithValue(mapApiError(error, 'Ошибка входа'))
    }
  }
)

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data)
      if (response.access_token) {
        tokenStorage.setTokens(response.access_token, response.refresh_token)
      }
      return {
        token: response.access_token || null,
        user: response.user ? mapUser(response.user) : null,
        operation_id: response.operation_id || null,
      }
    } catch (error) {
      return rejectWithValue(mapApiError(error, 'Ошибка регистрации'))
    }
  }
)

export const requestEmailCode = createAsyncThunk(
  'user/requestEmailCode',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.requestEmailVerification({ email })
      return { operation_id: response.operation_id }
    } catch (error) {
      return rejectWithValue(mapApiError(error, 'Ошибка отправки кода'))
    }
  }
)

export const approveCode = createAsyncThunk(
  'user/approveCode',
  async (data: { email?: string; phone_number?: string; code: string; operation_id: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.approveCode(data)
      console.log("approveCode response", response)
      return { token: response.token }
    } catch (error) {
      return rejectWithValue(mapApiError(error, 'Неверный код'))
    }
  }
)

export const loginEmail = createAsyncThunk(
  'user/loginEmail',
  async (token: string, { rejectWithValue }) => {
    console.log("token here", token)
    try {
      const response = await authApi.loginEmail(token)
      tokenStorage.setTokens(response.access_token, response.refresh_token)
      return { token: response.access_token, user: response.user ? mapUser(response.user) : null }
    } catch (error) {
      return rejectWithValue(mapApiError(error, 'Ошибка верификации'))
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe()
      return mapUser(response.user)
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 401) {
        tokenStorage.clearTokens()
      }
      return rejectWithValue(mapApiError(error, 'Пользователь не найден'))
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      tokenStorage.clearTokens()
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        if (action.payload.user) state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        if (action.payload.user) state.user = action.payload.user
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(requestEmailCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestEmailCode.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(requestEmailCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(approveCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(approveCode.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(approveCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(loginEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginEmail.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        if (action.payload.user) state.user = action.payload.user
      })
      .addCase(loginEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.token = null
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = userSlice.actions
export default userSlice.reducer

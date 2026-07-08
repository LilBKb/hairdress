import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { authApi, type RequestCodeRequest, type LoginWithCodeRequest } from '../../api/authApi'
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

export const requestLoginCode = createAsyncThunk(
  'user/requestCode',
  async (data: RequestCodeRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.requestCode(data)
      return { operation_id: response.operation_id }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка отправки кода')
    }
  }
)

export const loginWithCode = createAsyncThunk(
  'user/loginWithCode',
  async (data: LoginWithCodeRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.loginWithCode(data)
      tokenStorage.setTokens(response.access_token, response.refresh_token)
      return { token: response.access_token, user: mapUser(response.user) }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка входа')
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
      tokenStorage.clearTokens()
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка получения пользователя')
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
      .addCase(requestLoginCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestLoginCode.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(requestLoginCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(loginWithCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithCode.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(loginWithCode.rejected, (state, action) => {
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

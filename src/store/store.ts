import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import bookingReducer from './slices/bookingSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

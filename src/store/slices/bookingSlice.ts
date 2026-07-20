import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { bookingApi, type CreateBookingRequest } from "../../api/bookingApi";
import { mapApiError } from "../../api/errorMapper";
import type { Booking } from "../../interface/interface";

function mapBooking(raw: Record<string, unknown>): Booking {
  return {
    id: raw.id as number,
    username: raw.username as string,
    hairdresserId: raw.hairdresser_id as string,
    serviceId: raw.service_id as number,
    salonId: raw.salon_id as number,
    startsAt: raw.starts_at as string,
    endsAt: raw.ends_at as string,
    description: (raw.description as string) ?? "",
    status: (raw.status as string).replace("BOOKING_STATUS_", "").toLowerCase() as Booking["status"],
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  "booking/create",
  async (data: CreateBookingRequest, { rejectWithValue }) => {
    try {
      const booking = await bookingApi.create(data);
      return mapBooking(booking as unknown as Record<string, unknown>);
    } catch (error) {
      return rejectWithValue(mapApiError(error, "Ошибка создания записи"));
    }
  },
);

export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMy",
  async (username: string, { rejectWithValue }) => {
    try {
      const bookings = await bookingApi.getByUsername(username);
      return (bookings as unknown as Record<string, unknown>[]).map(mapBooking);
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 404) {
        return [];
      }
      return rejectWithValue(mapApiError(error, "Ошибка загрузки записей"));
    }
  },
);

export const fetchOccupiedSlots = createAsyncThunk(
  "booking/fetchOccupied",
  async (params: { hairdresserId: string }, { rejectWithValue }) => {
    try {
      const bookings = await bookingApi.getByHairdresser(params.hairdresserId);
      return (bookings as unknown as Record<string, unknown>[]).map(mapBooking);
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 404) {
        return [];
      }
      return rejectWithValue(mapApiError(error, "Ошибка загрузки занятых слотов"));
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (id: number, { rejectWithValue }) => {
    try {
      const booking = await bookingApi.updateStatus(id, "BOOKING_STATUS_CANCELLED");
      return mapBooking(booking as unknown as Record<string, unknown>);
    } catch (error) {
      return rejectWithValue(mapApiError(error, "Ошибка отмены записи"));
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOccupiedSlots.fulfilled, () => {
        // occupied slots stored separately isn't needed — we filter in the component
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) {
          state.bookings[idx] = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;

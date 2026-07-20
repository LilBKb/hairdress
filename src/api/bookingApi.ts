import { apiClient } from "./client";
import type { Booking } from "../interface/interface";

export interface CreateBookingRequest {
  username: string;
  hairdresser_id: string;
  service_id: number;
  salon_id: number;
  starts_at: string;
  ends_at: string;
  description?: string;
  status: string;
}

export const bookingApi = {
  create: async (data: CreateBookingRequest): Promise<Booking> => {
    const res = await apiClient.post("/api/v1/booking/create", data);
    return res.data.booking;
  },

  getByUsername: async (username: string): Promise<Booking[]> => {
    const res = await apiClient.get("/api/v1/booking", {
      params: { username },
    });
    return res.data.bookings ?? [];
  },

  getByHairdresser: async (
    hairdresserId: string,
  ): Promise<Booking[]> => {
    const res = await apiClient.get("/api/v1/booking", {
      params: { hairdresser_id: hairdresserId },
    });
    return res.data.bookings ?? [];
  },

  updateStatus: async (
    id: number,
    newStatus: string,
  ): Promise<Booking> => {
    const res = await apiClient.patch("/api/v1/booking", {
      id,
      new_status: newStatus,
    });
    return res.data.booking;
  },
};

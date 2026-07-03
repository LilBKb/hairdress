export const BookingStatus= {
  Pending:"pending",
  Confirmed:"confirmed",
  Cancelled:"cancelled",
  Completed:"completed",
} as const;
export type BookingStatus =
(typeof BookingStatus )[keyof typeof BookingStatus]
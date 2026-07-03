import type { ReactElement } from "react"
import type { BookingStatus } from "./enum"

export type Branch={
    name:string,
    color:string,
    logo:string,
    url:string,
    element:ReactElement,
    images:ImageType[]
}
export type ImageType={
    src:string,
    alt:string
}

export type BranchLinks={
    name:string,
    url:string
}

export interface User {
  username: string;
  fullName: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  username: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Hairdresser {
  id: string; // uuid
  username: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Salon {
  id: number;
  salonName: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: number;
  salonId: number;
  serviceName: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  username: string;
  hairdresserId: string;
  serviceId: number;
  salonId: number;
  startsAt: string;
  endsAt: string;
  description?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HairdresserSchedule {
  id: number;
  hairdresserId: string;
  salonId: number;
  patternId?: number;
  workDate: string;
  shiftStart: string;
  shiftEnd: string;
  isAvailable: boolean;
  source: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HairdresserWorkPattern {
  id: number;
  hairdresserId: string;
  salonId: number;
  weekday: number;
  shiftStart: string;
  shiftEnd: string;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
}

export interface HairdresserSalon {
  hairdresserId: string;
  salonId: number;
}

export interface HairdresserService {
  hairdresserId: string;
  serviceId: number;
}

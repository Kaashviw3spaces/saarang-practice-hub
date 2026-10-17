/* ─── Room types ──────────────────────────────────────────────────────────── */

export type RoomStatus =
  | "available"
  | "reserved"
  | "occupied"
  | "departure_pending"
  | "occupancy_uncertain";

export type PracticeMode = "individual" | "collaborative" | "band_rehearsal";

export type CompatibilityLevel =
  | "compatible"
  | "conditionally_compatible"
  | "incompatible"
  | "insufficient_info";

export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  status: RoomStatus;
  equipment: string[];
  acousticProperties: string;
  imageUrl?: string;
  nextAvailableAt?: Date;
  currentBooking?: {
    memberName: string;
    instrument: string;
    mode: PracticeMode;
    endsAt: Date;
  };
}

/* ─── Booking types ───────────────────────────────────────────────────────── */

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  memberName: string;
  instrument: string;
  mode: PracticeMode;
  startsAt: Date;
  endsAt: Date;
  status: BookingStatus;
  compatibilityLevel?: CompatibilityLevel;
  compatibilityNote?: string;
}

/* ─── Instrument / equipment types ───────────────────────────────────────── */

export interface Instrument {
  id: string;
  name: string;
  category: "acoustic" | "electric" | "electronic";
  baseNoiseLevelDb: number;
  physicalSoundEvenWithHeadphones: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  type: "headphones" | "amplifier" | "speaker" | "microphone" | "interface" | "cable" | "other";
  producesAudioOutput: boolean;
}

/* ─── User types ──────────────────────────────────────────────────────────── */

export type UserRole = "member" | "admin";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  instrument?: string;
  noiseTolerance?: "low" | "medium" | "high";
  collaborationPreference?: "solo" | "open" | "collaborative";
  avatarUrl?: string;
}

/* ─── Notification types ──────────────────────────────────────────────────── */

export type NotificationType =
  | "mid_session"
  | "pre_expiry"
  | "final_reminder"
  | "booking_confirmed"
  | "booking_cancelled"
  | "extension_approved"
  | "extension_denied"
  | "slot_released";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  bookingId?: string;
  createdAt: Date;
  read: boolean;
}


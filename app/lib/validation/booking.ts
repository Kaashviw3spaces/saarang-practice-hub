import { z } from "zod";

export const bookingFormSchema = z.object({
  roomId: z.string().uuid("Invalid room selected"),
  instrument: z.string().min(1, "Please choose your instrument"),
  mode: z.enum(["individual", "collaborative", "band_rehearsal"]),
  date: z.string().min(1, "Please select a date"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format (HH:MM)"),
  durationMinutes: z.number().int().refine((val) => [15, 30, 45, 60, 90].includes(val), {
    message: "Valid duration required: 15, 30, 45, 60, or 90 minutes",
  }),
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

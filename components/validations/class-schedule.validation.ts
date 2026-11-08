import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const CreateClassScheduleZodSchema = z
  .object({
    dayOfWeek: z
      .array(z.number().int().min(1).max(7))
      .min(1, "Select at least one day")
      .max(7, "Select valid days only"),

    startTime: z
      .string()
      .regex(timeRegex, "Start time must be in HH:mm format"),

    endTime: z.string().regex(timeRegex, "End time must be in HH:mm format"),

    sectionId: z.uuid("Section ID must be a valid UUID"),

    roomId: z
      .union([z.uuid("Room ID must be a valid UUID"), z.literal("")])
      .optional(),

    departmentId: z.uuid("Department ID must be a valid UUID"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

import { z } from "zod";

export const CreateSectionZodSchema = z.object({
  name: z.string().trim().min(1, "Section name is required"),

  capacity: z
    .number()
    .int("Capacity must be an integer")
    .min(1, "Capacity must be at least 1"),

  status: z.enum(["OPEN", "CLOSED", "FULL", "CANCELLED", "COMPLETED"]),

  courseId: z.uuid("Course ID must be a valid UUID"),

  semesterId: z.uuid("Semester ID must be a valid UUID"),

  departmentId: z.uuid("Department ID must be a valid UUID"),

  roomId: z.union([z.uuid("Room ID must be a valid UUID"), z.literal("")]),
});

export type CreateSectionInput = z.input<typeof CreateSectionZodSchema>;

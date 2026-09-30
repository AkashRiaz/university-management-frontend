import { z } from "zod";

export const CreateFeeStructureZodSchema = z.object({
  name: z
    .string()
    .min(1, "Fee structure name is required")
    .max(255, "Fee structure name cannot exceed 255 characters"),

  description: z.string().optional(),

  programId: z.uuid("Program ID is required").optional(),

  semesterId: z.uuid("Semester ID is required").optional(),
});

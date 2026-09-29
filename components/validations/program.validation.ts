import z from "zod";

export const CreateProgramZodSchema = z.object({
  name: z.string().min(1, "Program name is required"),

  code: z.string().min(1, "Program code is required"),

  description: z.string().optional(),

  durationYears: z.number().positive("Duration years must be greater than 0"),

  totalCredits: z.number().positive("Total credits must be greater than 0"),

  departmentId: z.string().min(1, "Department ID is required"),
});

export type CreateProgramInput = z.input<typeof CreateProgramZodSchema>;

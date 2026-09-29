import z from "zod";

export const FacultySchema = z.object({
  name: z.string().trim().min(1, "Faculty name is required"),
  code: z.string().trim().min(1, "Faculty code is required"),
  description: z.string().trim(),
});

export type FacultyInput = z.input<typeof FacultySchema>;

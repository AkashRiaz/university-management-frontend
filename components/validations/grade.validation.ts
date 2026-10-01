import z from "zod";

export const createGradeZodSchema = z.object({
  letter: z
    .string()
    .min(1, "Grade letter is required")
    .max(20, "Grade letter cannot exceed 20 characters")
    .trim(),

  minMarks: z.number().nonnegative("Minimum marks cannot be negative"),

  maxMarks: z.number().nonnegative("Maximum marks cannot be negative"),

  gradePoint: z.number().nonnegative("Grade point cannot be negative"),

  type: z.enum(["LETTER", "NUMERIC", "PASS_FAIL"], {
    message: "Invalid grade type",
  }),

  gradeScaleId: z.uuid("Invalid grade scale ID"),
});

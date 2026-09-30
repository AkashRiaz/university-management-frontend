import z from "zod";

export const createStudentScholarshipZodSchema = z.object({
  studentId: z.uuid("Invalid student ID"),

  scholarshipId: z.uuid("Invalid scholarship ID"),

  semesterId: z.uuid("Invalid semester ID"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
});

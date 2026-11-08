import { z } from "zod";

export const CreateSectionInstructorZodSchema = z.object({
  sectionId: z.uuid("Section is required"),
  instructorId: z.uuid("Instructor is required"),
  isPrimary: z.boolean(),
});

export const UpdateSectionInstructorZodSchema = z.object({
  isPrimary: z.boolean(),
});

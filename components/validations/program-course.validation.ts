import { z } from "zod";

export const CreateProgramCourseZodSchema = z.object({
  programId: z.uuid("Program ID must be a valid UUID"),

  courseId: z.uuid("Course ID must be a valid UUID"),

  semesterNumber: z
    .number()
    .int("Semester number must be an integer")
    .positive("Semester number must be greater than 0"),

  isRequired: z.boolean(),
});

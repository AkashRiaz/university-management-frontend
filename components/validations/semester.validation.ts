import z from "zod";

export const CreateSemesterZodSchema = z
  .object({
    name: z.enum(["SPRING", "SUMMER", "FALL", "WINTER"]),

    startDate: z.iso.date(),

    endDate: z.iso.date(),

    registrationStart: z.iso.date(),

    registrationEnd: z.iso.date(),

    status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"]),

    academicYearId: z.uuid("Academic Year ID must be a valid UUID"),
  })

  // Semester dates
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })

  // Registration dates
  .refine((data) => data.registrationEnd > data.registrationStart, {
    message: "Registration end date must be after registration start date",
    path: ["registrationEnd"],
  })

  // Registration must finish before semester
  .refine((data) => data.registrationEnd <= data.startDate, {
    message: "Registration must end before the semester starts",
    path: ["registrationEnd"],
  });


  export type CreateSemesterInput = z.input<typeof CreateSemesterZodSchema>;
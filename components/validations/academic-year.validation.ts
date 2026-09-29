import z from "zod";

export const CreateAcademicYearZodSchema = z
  .object({
    name: z.string().min(1, "Academic year name is required").trim(),

    startDate: z.string({
      message: "Valid start date is required",
    }),

    endDate: z.string({
      message: "Valid end date is required",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

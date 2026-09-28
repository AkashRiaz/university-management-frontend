import z from "zod";

export const CreateDepartmentZodSchema = z.object({
  name: z.string().trim().min(1, "Department name is required"),

  code: z.string().trim().min(1, "Department code is required"),

  description: z.string().trim().optional(),

  building: z.string().trim().optional(),

  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Enter a valid phone number")
    .optional(),

  email: z.email("Invalid email address").optional(),

  facultyId: z.uuid("Invalid faculty ID"),
});

export type CreateDepartmentInput = z.input<typeof CreateDepartmentZodSchema>;

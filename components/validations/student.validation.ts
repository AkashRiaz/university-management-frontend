import z from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  departmentId: z.uuid({ message: "Department ID must be a valid UUID" }),
  dateOfBirth: z.string().optional(),
  admissionDate: z
    .string()
    .min(1, "Admission date is required")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Invalid admission date",
    ),
  admissionYear: z
    .number()
    .int()
    .min(2000, "Invalid admission year")
    .max(2100, "Invalid admission year"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Enter a valid phone number")
    .optional(),
  programId: z.uuid({ message: "Program ID must be a valid UUID" }),
  address: z.string().optional(),
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Enter a valid emergency contact number")
    .optional(),
});

export type createStudentInput = z.infer<typeof createStudentSchema>;

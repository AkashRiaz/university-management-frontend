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

export const UpdateStudentAdminZodSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),

  email: z.email("Invalid email address").optional(),

  departmentId: z
    .string()
    .trim()
    .min(1, "Department ID cannot be empty")
    .optional(),

  programId: z.string().trim().min(1, "Program ID cannot be empty").optional(),

  admissionDate: z.coerce.date().optional(),

  admissionYear: z.coerce
    .number()
    .int("Admission year must be an integer")
    .min(2000)
    .max(new Date().getFullYear() + 1)
    .optional(),

  currentSemesterNumber: z.coerce.number().int().min(1).optional(),

  status: z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "SUSPENDED"]).optional(),

  academicStatus: z
    .enum(["GOOD_STANDING", "PROBATION", "SUSPENDED", "DISMISSED"])
    .optional(),
});

export const UpdateStudentSelfZodSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
});

export type createStudentInput = z.infer<typeof createStudentSchema>;
export type updateStudentInput = z.input<typeof UpdateStudentAdminZodSchema>;

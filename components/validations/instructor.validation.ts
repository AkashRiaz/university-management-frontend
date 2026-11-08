import { GENDER, InstructorDesignation } from "@/lib/enum";
import z from "zod";

export const CreateInstructorZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z.email("Invalid email address").toLowerCase(),

  designation: z
    .union([z.enum(Object.values(InstructorDesignation)), z.literal("")])
    .refine((value) => value !== "", {
      message: "Please select a designation",
    }),

  specialization: z
    .string()
    .max(200, "Specialization cannot exceed 200 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Enter a valid phone number")
    .optional(),

  officeRoom: z
    .string()
    .max(100, "Office room cannot exceed 100 characters")
    .optional(),

  joiningDate: z
    .string()
    .min(1, "Joining date is required")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Please select a valid joining date",
    ),

  dateOfBirth: z.string().optional(),

  gender: z.union([z.enum(Object.values(GENDER)), z.literal("")]),

  address: z
    .string()
    .max(500, "Address cannot exceed 500 characters")
    .optional(),

  bio: z.string().max(2000, "Bio cannot exceed 2000 characters").optional(),

  qualification: z
    .string()
    .max(500, "Qualification cannot exceed 500 characters")
    .optional(),

  departmentId: z.uuid("Invalid department ID"),
});

export const UpdateInstructorAdminZodSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  designation: z.enum(InstructorDesignation).optional(),

  joiningDate: z.coerce.date().optional(),

  departmentId: z.uuid().optional(),

  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]).optional(),
});

export type createInstructorInput = z.input<typeof CreateInstructorZodSchema>;
export type updateInstructorAdminInput = z.input<typeof UpdateInstructorAdminZodSchema>;
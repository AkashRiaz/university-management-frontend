import z from "zod";

export const createScholarshipZodSchema = z
  .object({
    name: z.string().trim().min(1, "Scholarship name is required"),
    type: z.enum(
      ["MERIT", "NEED_BASED", "ATHLETIC", "GOVERNMENT", "DEPARTMENT", "OTHER"],
      {
        message: "Invalid scholarship type",
      },
    ),

    percentage: z
      .number()
      .positive("Percentage must be greater than 0")
      .max(100, "Percentage cannot exceed 100")
      .optional(),

    fixedAmount: z
      .number()
      .positive("Fixed amount must be greater than 0")
      .optional(),

    description: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]).optional(),
  })
  .refine(
    (data) =>
      !(data.percentage !== undefined && data.fixedAmount !== undefined),
    {
      message: "Percentage and fixed amount cannot be provided together",
      path: ["percentage"],
    },
  )
  .refine(
    (data) => data.percentage !== undefined || data.fixedAmount !== undefined,
    {
      message: "Either percentage or fixed amount is required",
      path: ["percentage"],
    },
  );

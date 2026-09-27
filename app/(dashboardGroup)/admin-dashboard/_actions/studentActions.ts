"use server";

import { createStudentSchema } from "@/components/validations/student.validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type CreateStudentState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Record<string, unknown> | null;
};

export const createStudentAction = async (
  prevState: CreateStudentState | null,
  formData: FormData,
): Promise<CreateStudentState> => {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    departmentId: formData.get("departmentId"),
    admissionDate: formData.get("admissionDate"),
    admissionYear: Number(formData.get("admissionYear")),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    programId: formData.get("programId"),
    address: formData.get("address"),
    emergencyContactName: formData.get("emergencyContactName"),
    emergencyContactPhone: formData.get("emergencyContactPhone"),
  };

  const validation = createStudentSchema.safeParse(payload);

  if (!validation.success) {
    return {
      success: false,
      statusCode: 400,
      message:
        validation.error.issues[0]?.message || "Invalid student information",
    };
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      statusCode: 401,
      message: "User not logged in",
    };
  }

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/students/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validation.data),
      cache: "no-store",
    });

    const result = await response.json();


    if (!response.ok || !result?.success) {
      return {
        success: false,
        statusCode: response.status,
        message: result?.message || "Failed to create student",
        data: null,
      };
    }

    // redirect("/admin-dashboard/students");

    return {
      success: true,
      message: "Student created successfully",
      statusCode: response.status,
      data: result?.data || null,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Something went wrong. Please try again.",
    };
  }
};

import { GENDER, InstructorDesignation } from "@/lib/enum";
import { IDepartment } from "./department.type";
import { IUser } from "./user.type";

export type IInstructor = {
  id: string;
  employeeId?: string;
  userId?: string;

  designation?: InstructorDesignation;
  specialization?: string | null;
  phone?: string | null;
  officeRoom?: string | null;

  joiningDate?: string;
  dateOfBirth?: string | null;

  gender?: GENDER | null;

  address?: string | null;
  bio?: string | null;
  qualification?: string | null;

  additionalFiles?: unknown | null;

  departmentId?: string;

  createdAt: string;
  updatedAt: string;

  // Relations
  user?: IUser;
  department?: IDepartment;
};

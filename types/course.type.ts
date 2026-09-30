import { IDepartment } from "./department.type";

export type CourseType = "THEORY" | "LAB" | "PROJECT" | "THESIS" | "SEMINAR";
export type CourseLevel = "UNDERGRADUATE" | "POSTGRADUATE" | "PHD";

export type ICourse = {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  credit: number;
  courseType: CourseType;
  courseLevel: CourseLevel;
  departmentId: string;
  department?: IDepartment | null;
  createdAt: string;
  updatedAt: string;
};

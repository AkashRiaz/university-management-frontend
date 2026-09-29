import { IDepartment } from "./department.type";

export type Program = {
  id: string;
  name?: string | null;
  code?: string | null;
  description?: string | null;
  durationYears?: number | null;
  totalCredits?: string | null;
  departmentId?: string | null;
  department?: IDepartment | null;
  createdAt: string;
  updatedAt: string;
};

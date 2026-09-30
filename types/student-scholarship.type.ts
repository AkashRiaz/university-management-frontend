import { IScholarship } from "./scholarship.type";
import { ISemester } from "./semester.type";

export type StudentScholarshipStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type IStudentScholarshipStudent = {
  id: string;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export type IStudentScholarship = {
  id: string;
  studentId: string;
  scholarshipId: string;
  semesterId: string;
  status?: StudentScholarshipStatus | null;
  student?: IStudentScholarshipStudent | null;
  scholarship?: IScholarship | null;
  semester?: ISemester | null;
  createdAt: string;
  updatedAt: string;
};

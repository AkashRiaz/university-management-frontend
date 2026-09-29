import { IFaculty } from "./faculty.type";

export type IDepartment = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  building: string | null;
  phone: string | null;
  email: string | null;
  facultyId: string;
  faculty?: IFaculty;
  createdAt: string;
  updatedAt: string;
};

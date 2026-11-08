import { ICourse } from "./course.type";
import { IDepartment } from "./department.type";
import { IRoom } from "./room.type";
import { ISemester } from "./semester.type";

export type SectionStatus =
  | "OPEN"
  | "CLOSED"
  | "FULL"
  | "CANCELLED"
  | "COMPLETED";

export type ISection = {
  id: string;
  name: string;
  capacity: number;
  status: SectionStatus;
  courseId: string;
  semesterId: string;
  departmentId: string;
  roomId?: string | null;
  course?: ICourse | null;
  semester?: ISemester | null;
  department?: IDepartment | null;
  room?: IRoom | null;
  createdAt: string;
  updatedAt: string;
};

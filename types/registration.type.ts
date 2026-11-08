import { ICourse } from "./course.type";
import { ISection } from "./section.type";
import { ISemester } from "./semester.type";

export type RegistrationStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "DROPPED"
  | "COMPLETED"
  | "CANCELLED";

export type CourseRegistrationStatus = "REGISTERED" | "DROPPED" | "COMPLETED";

export type ICourseRegistration = {
  id: string;
  registrationId: string;
  sectionId: string;
  status: CourseRegistrationStatus;
  registeredAt?: string;
  section?: ISection & {
    schedules?: Array<{
      id: string;
      dayOfWeek?: string;
      startTime?: string;
      endTime?: string;
    }>;
    instructors?: Array<{
      instructor?: {
        user?: { name?: string | null; email?: string | null };
      };
    }>;
  };
  course?: ICourse | null;
};

export type IRegistration = {
  id: string;
  registrationNumber: string;
  studentId: string;
  semesterId: string;
  programSemesterNumber: number;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  semester?: ISemester | null;
  courses?: ICourseRegistration[];
  student?: {
    studentId?: string;
    user?: { name?: string | null; email?: string | null };
  } | null;
};

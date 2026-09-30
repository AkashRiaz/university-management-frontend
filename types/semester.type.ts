export type SemesterName = "SPRING" | "SUMMER" | "FALL" | "WINTER";
export type SemesterStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type ISemester = {
  id: string;
  name: SemesterName;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  status?: SemesterStatus;
  academicYearId: string;
  academicYear?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

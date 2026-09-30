import { ICourse } from "./course.type";
import { Program } from "./program.type";

export type IProgramCourse = {
  id: string;
  programId: string;
  courseId: string;
  semesterNumber: number;
  isRequired: boolean;
  program?: Program | null;
  course?: ICourse | null;
  createdAt: string;
  updatedAt: string;
};

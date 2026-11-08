import { IInstructor } from "./instructor.type";
import { ISection } from "./section.type";

export type ISectionInstructor = {
  id: string;
  sectionId: string;
  instructorId: string;
  isPrimary: boolean;
  section?: ISection | null;
  instructor?: IInstructor | null;
  createdAt?: string;
  updatedAt?: string;
};

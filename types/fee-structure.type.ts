import { Program } from "./program.type";
import { ISemester } from "./semester.type";

export type IFeeStructure = {
  id: string;
  name: string;
  description?: string | null;
  programId?: string | null;
  semesterId?: string | null;
  program?: Program | null;
  semester?: ISemester | null;
  createdAt: string;
  updatedAt: string;
};

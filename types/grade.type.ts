import { IGradeScale } from "./grade-scale.type";

export type GradeType = "LETTER" | "NUMERIC" | "PASS_FAIL";

export type IGrade = {
  id: string;
  letter: string;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
  type: GradeType;
  gradeScaleId: string;
  gradeScale?: IGradeScale | null;
  createdAt: string;
  updatedAt: string;
};

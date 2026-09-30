export type ScholarshipType =
  | "MERIT"
  | "NEED_BASED"
  | "ATHLETIC"
  | "GOVERNMENT"
  | "DEPARTMENT"
  | "OTHER";

export type ScholarshipStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export type IScholarship = {
  id: string;
  name: string;
  type: ScholarshipType;
  percentage?: number | null;
  fixedAmount?: number | null;
  description?: string | null;
  status?: ScholarshipStatus | null;
  createdAt: string;
  updatedAt: string;
};

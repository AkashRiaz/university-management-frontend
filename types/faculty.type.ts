export type IFaculty = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  _count?: {
    departments?: number;
  };
  createdAt: string;
  updatedAt: string;
};

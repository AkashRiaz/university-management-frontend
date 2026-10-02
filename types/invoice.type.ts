import type { Student } from "@/app/(dashboardGroup)/admin-dashboard/_actions/studentActions";
import { ISemester } from "./semester.type";

export type IInvoice = {
  id: string;
  invoiceNumber?: string | null;
  studentId: string;
  semesterId: string;
  dueDate: string;
  discount?: number | null;
  tax?: number | null;
  subtotal?: number | null;
  totalAmount?: number | null;
  status?: string | null;
  student?: Student | null;
  semester?: ISemester | null;
  createdAt: string;
  updatedAt: string;
};

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
  total?: number | string | null;
  totalAmount?: number | null;
  dueAmount?: number | string | null;
  paidAmount?: number | string | null;
  status?: string | null;
  student?: Student | null;
  semester?: ISemester | null;
  createdAt: string;
  updatedAt: string;
};

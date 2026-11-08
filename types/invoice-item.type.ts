export type IInvoiceItem = {
  id: string;
  invoiceId: string;
  name: string;
  description?: string | null;
  quantity?: number | null;
  unitPrice: number;
  totalPrice?: number | null;
  createdAt: string;
  updatedAt: string;
};
"use server";

import { AlertCircle, ReceiptText } from "lucide-react";
import TableBackButton from "@/components/ui/TableBackButton";
import { SearchBar } from "@/components/ui/SearchBar";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllInvoiceItemsAction } from "../../_actions/invoiceItemActions";
import InvoiceItemCreate from "./InvoiceItemCreate";
import InvoiceItemDelete from "./InvoiceItemDelete";

const money = (value: unknown) => { const amount = Number(value); return Number.isFinite(amount) ? amount.toFixed(2) : "-"; };

export default async function InvoiceItemTable({ invoiceId, searchParams }: { invoiceId: string; searchParams?: { [key: string]: string | string[] | undefined } }) {
  const result = await getAllInvoiceItemsAction(invoiceId, { query: searchParams });
  const items = result.data || [];
  const page = Math.max(1, Number(result.meta?.page ?? 1));
  const limit = Math.max(1, Number(result.meta?.limit ?? 10));
  if (!result.success) return <div className="rounded-xl border border-destructive/20 bg-card p-10 text-center shadow-sm"><AlertCircle className="mx-auto text-destructive" /><h3 className="mt-4 font-semibold text-destructive">Failed to load invoice items</h3><p className="text-sm text-muted-foreground">{result.message}</p></div>;
  return <div className="min-w-0 overflow-hidden shadow-sm">
    <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:items-center sm:justify-between md:mx-0"><div><h2 className="text-lg font-semibold"><TableBackButton /> Invoice Items</h2><p className="text-sm">Manage items in this invoice</p></div><div className="flex w-full items-center gap-2 sm:w-auto"><SearchBar /><InvoiceItemCreate invoiceId={invoiceId} /></div></div>
    <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0"><Table className="min-w-[850px]"><TableHeader><TableRow className="bg-gray-50 hover:bg-gray-50"><TableHead className="font-semibold text-gray-700">#</TableHead><TableHead className="font-semibold text-gray-700">Name</TableHead><TableHead className="font-semibold text-gray-700">Description</TableHead><TableHead className="font-semibold text-gray-700">Quantity</TableHead><TableHead className="font-semibold text-gray-700">Unit Price</TableHead><TableHead className="font-semibold text-gray-700">Total</TableHead><TableHead className="text-right font-semibold text-gray-700">Action</TableHead></TableRow></TableHeader><TableBody>{items.length === 0 ? <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No invoice items found.</TableCell></TableRow> : items.map((item, index) => <TableRow key={item.id}><TableCell className="font-medium text-gray-500">{(page - 1) * limit + index + 1}</TableCell><TableCell><div className="flex items-center gap-2"><ReceiptText className="size-4 text-muted-foreground" /><span className="font-medium">{item.name}</span></div></TableCell><TableCell className="text-muted-foreground">{item.description || "-"}</TableCell><TableCell>{item.quantity ?? 1}</TableCell><TableCell>{money(item.unitPrice)}</TableCell><TableCell>{money(item.totalPrice ?? Number(item.unitPrice) * Number(item.quantity ?? 1))}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><InvoiceItemCreate invoiceId={invoiceId} item={item} trigger="edit" /><InvoiceItemDelete itemId={item.id} itemName={item.name} /></div></TableCell></TableRow>)}</TableBody></Table></div>
    <CustomPagination currentPage={page} totalPages={Math.max(1, Number(result.meta?.totalPages ?? 1))} />
  </div>;
}

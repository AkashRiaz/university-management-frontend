"use server";
import TableBackButton from "@/components/ui/TableBackButton";

import { AlertCircle, ClipboardList } from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFeeStructureItemsByFeeStructureAction } from "../../_actions/feeStructureItemActions";
import FeeStructureItemCreate from "./FeeStructureItemCreate";
import FeeStructureItemDelete from "./FeeStructureItemDelete";

const formatAmount = (amount: number | string | null | undefined) => {
  const value = Number(amount);
  return Number.isFinite(value) ? value.toFixed(2) : "-";
};

const FeeStructureItemTable = async ({
  feeStructureId,
  searchParams,
}: {
  feeStructureId: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const result = await getFeeStructureItemsByFeeStructureAction(
    feeStructureId,
    {
      query: searchParams,
    },
  );
  const items = result.data || [];
  const currentPage = Math.max(1, Number(result.meta?.page ?? 1));
  const limit = Math.max(1, Number(result.meta?.limit ?? 10));
  const totalPages = Math.max(1, Number(result.meta?.totalPages ?? 1));

  if (!result.success) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" />
        </div>
        <h3 className="mt-4 font-semibold text-destructive">
          Failed to load fee items
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Fee Structure Items
          </h2>
          <p className="text-sm">Manage items in this fee structure</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchBar />
          <FeeStructureItemCreate feeStructureId={feeStructureId} />
        </div>
      </div>
      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="w-full min-w-225 table-fixed">
          <colgroup>
            <col className="w-16" />
            <col className="w-64" />
            <col className="w-96" />
            <col className="w-40" />
            <col className="w-40" />
          </colgroup>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">#</TableHead>
              <TableHead className="font-semibold text-gray-700">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Amount
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No fee structure items found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2">
                      <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 truncate font-medium">
                        {item.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="truncate">{item.description || "-"}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatAmount(item.amount)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <FeeStructureItemCreate
                        feeStructureId={feeStructureId}
                        item={item}
                        trigger="edit"
                      />
                      <FeeStructureItemDelete
                        itemId={item.id}
                        itemName={item.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <CustomPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default FeeStructureItemTable;

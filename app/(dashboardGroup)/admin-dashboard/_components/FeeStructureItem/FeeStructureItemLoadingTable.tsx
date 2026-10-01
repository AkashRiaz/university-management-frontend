import TableBackButton from "@/components/ui/TableBackButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchBar } from "@/components/ui/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";

const FeeStructureItemLoadingTable = () => (
  <div className="min-w-0 overflow-hidden shadow-sm">
    <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:mx-0">
      <div>
        <h2 className="text-lg font-semibold">
          <TableBackButton />
          Fee Structure Items
        </h2>
        <p className="text-sm text-muted-foreground">Manage fee items</p>
      </div>
      <div className="flex w-full items-center gap-4 sm:w-auto">
        <SearchBar />
        <Skeleton className="h-8 w-32 rounded-md" />
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
            {["#", "Name", "Description", "Amount", "Action"].map((heading) => (
              <TableHead key={heading} className="font-semibold text-gray-700">
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 5 }).map((__, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <div className="flex justify-end gap-2 py-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-8 rounded-md" />
      ))}
    </div>
  </div>
);

export default FeeStructureItemLoadingTable;

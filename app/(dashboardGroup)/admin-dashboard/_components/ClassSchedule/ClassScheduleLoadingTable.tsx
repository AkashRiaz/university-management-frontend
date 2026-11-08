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

const headings = [
  "#",
  "Day",
  "Time",
  "Department",
  "Section",
  "Room",
  "Action",
];

const ClassScheduleLoadingTable = () => (
  <div className="min-w-0 overflow-hidden shadow-sm">
    <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:items-center sm:justify-between md:mx-0">
      <div>
        <h2 className="text-lg font-semibold">Class Schedules</h2>
        <p className="text-sm text-muted-foreground">Manage class schedules</p>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <SearchBar compact />
        <Skeleton className="h-8 w-36 shrink-0 rounded-md" />
      </div>
    </div>
    <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
      <Table className="min-w-[820px]">
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            {headings.map((heading) => (
              <TableHead key={heading} className="font-semibold text-gray-700">
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {headings.map((heading) => (
                <TableCell key={heading}>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default ClassScheduleLoadingTable;

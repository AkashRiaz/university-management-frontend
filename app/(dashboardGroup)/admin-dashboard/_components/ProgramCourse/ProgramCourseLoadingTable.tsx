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

const ProgramCourseLoadingTable = () => (
  <div className="min-w-0 overflow-hidden shadow-sm">
    <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
      <div>
        <h2 className="text-lg font-semibold">Program Courses</h2>
        <p className="text-sm text-muted-foreground">
          Manage courses assigned to programs
        </p>
      </div>
      <div className="flex min-w-0 w-full flex-nowrap items-center gap-2 sm:w-auto sm:justify-end">
        <SearchBar compact />
        <Skeleton className="h-8 w-36 shrink-0 rounded-md" />
      </div>
    </div>
    <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            {["#", "Program", "Course", "Semester", "Required", "Action"].map(
              (heading) => (
                <TableHead
                  key={heading}
                  className="font-semibold text-gray-700"
                >
                  {heading}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 6 }).map((__, cellIndex) => (
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

export default ProgramCourseLoadingTable;

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

const SemesterLoadingTable = () => (
  <div className="overflow-hidden shadow-sm">
    <div className="flex items-center justify-between border-b py-4">
      <div>
        <h2 className="text-lg font-semibold">Semesters</h2>
        <p className="text-sm text-muted-foreground">
          Manage all registered semesters
        </p>
      </div>
      <div className="flex items-center gap-4">
        <SearchBar />
        <Skeleton className="h-8 w-36 rounded-md" />
      </div>
    </div>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            {[
              "#",
              "Semester",
              "Academic Year",
              "Semester Dates",
              "Registration",
              "Status",
              "Action",
            ].map((heading) => (
              <TableHead key={heading} className="font-semibold text-gray-700">
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 7 }).map((__, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-4 w-24" />
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

export default SemesterLoadingTable;

"use server";
import TableBackButton from "@/components/ui/TableBackButton";

import { AlertCircle, DoorOpen } from "lucide-react";
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
import { getAllRoomsAction } from "../../_actions/roomActions";
import RoomCreate from "./RoomCreate";
import RoomDelete from "./RoomDelete";

type RoomTableProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

const RoomTable = async ({ searchParams }: RoomTableProps) => {
  const result = await getAllRoomsAction({ query: searchParams });
  const rooms = result.data || [];
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
          Failed to load rooms
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden shadow-sm">
      <div className="mx-1 flex flex-col gap-3 border-b py-4 sm:mx-2 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between md:mx-0">
        <div>
          <h2 className="text-lg font-semibold">
            <TableBackButton />
            Rooms
          </h2>
          <p className="text-sm">Manage all registered rooms</p>
        </div>
        <div className="flex min-w-0 w-full flex-nowrap items-center gap-2 sm:w-auto sm:justify-end">
          <SearchBar compact />
          <RoomCreate />
        </div>
      </div>

      <div className="mx-1 overflow-x-auto sm:mx-2 md:mx-0">
        <Table className="min-w-[820px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-15 font-semibold text-gray-700">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Building
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Room Number
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Capacity
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Created Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Updated Date
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No rooms found.
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room, index) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DoorOpen className="size-4 text-muted-foreground" />
                      <span className="font-medium">{room.building}</span>
                    </div>
                  </TableCell>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{formatDate(room.createdAt)}</TableCell>
                  <TableCell>{formatDate(room.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <RoomCreate room={room} trigger="edit" />
                      <RoomDelete
                        roomId={room.id}
                        roomName={`${room.building} ${room.roomNumber}`}
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

export default RoomTable;

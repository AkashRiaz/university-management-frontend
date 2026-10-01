import { IDepartment } from "./department.type";
import { IRoom } from "./room.type";
import { ISection } from "./section.type";

export type IClassSchedule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  sectionId: string;
  roomId?: string | null;
  departmentId: string;
  section?: ISection | null;
  room?: IRoom | null;
  department?: IDepartment | null;
  createdAt: string;
  updatedAt: string;
};

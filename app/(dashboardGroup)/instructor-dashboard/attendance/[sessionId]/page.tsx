import { notFound } from "next/navigation";
import { getAttendanceStudentsAction } from "../../_actions/attendanceActions";
import AttendanceRoster from "../../_components/AttendanceRoster";

const AttendancePage = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;
  const result = await getAttendanceStudentsAction(sessionId);
  if (!result.success) notFound();

  return (
    <div className="p-4 md:p-6">
      <AttendanceRoster sessionId={sessionId} students={result.data || []} />
    </div>
  );
};

export default AttendancePage;

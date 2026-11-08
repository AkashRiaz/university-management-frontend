import { notFound } from "next/navigation";
import { getAttendanceStudentsAction } from "../../_actions/attendanceActions";
import AttendanceRoster from "../../_components/AttendanceRoster";
import { makeDemoAttendanceStudents, parseDemoCount } from "@/lib/demo-data";

const AttendancePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { sessionId } = await params;
  // `?demo=1000` renders representative data to test the virtualized roster.
  const demoCount = parseDemoCount((await searchParams).demo);

  if (demoCount) {
    return (
      <div className="p-4 md:p-6">
        <AttendanceRoster
          sessionId={sessionId}
          students={makeDemoAttendanceStudents(demoCount)}
          isDemo
        />
      </div>
    );
  }

  const result = await getAttendanceStudentsAction(sessionId);
  if (!result.success) notFound();

  return (
    <div className="p-4 md:p-6">
      <AttendanceRoster sessionId={sessionId} students={result.data || []} />
    </div>
  );
};

export default AttendancePage;

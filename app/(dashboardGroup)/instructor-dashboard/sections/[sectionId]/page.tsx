import { notFound } from "next/navigation";
import { getAttendanceSessionsAction } from "../../_actions/attendanceActions";
import { getMyInstructorSectionsAction } from "../../_actions/sectionActions";
import AttendanceSessionManager from "../../_components/AttendanceSessionManager";

const SectionPage = async ({ params }: { params: Promise<{ sectionId: string }> }) => {
  const { sectionId } = await params;
  const [sectionsResult, sessionsResult] = await Promise.all([
    getMyInstructorSectionsAction(),
    getAttendanceSessionsAction(sectionId),
  ]);
  const assignment = sectionsResult.data?.find((item) => item.section?.id === sectionId);
  if (!assignment) notFound();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <p className="text-sm text-muted-foreground">{assignment.section?.course?.code}</p>
        <h1 className="text-2xl font-semibold">{assignment.section?.course?.title}</h1>
        <p className="text-sm text-muted-foreground">Section {assignment.section?.name} · {assignment.section?.semester?.name}</p>
      </div>
      <AttendanceSessionManager sectionId={sectionId} sessions={sessionsResult.data || []} />
    </div>
  );
};

export default SectionPage;

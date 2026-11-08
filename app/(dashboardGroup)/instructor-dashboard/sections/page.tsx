import Link from "next/link";
import { getMyInstructorSectionsAction } from "../_actions/sectionActions";

const InstructorSectionsPage = async () => {
  const result = await getMyInstructorSectionsAction();
  const sections = result.data || [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div><h1 className="text-2xl font-semibold">My sections</h1><p className="text-sm text-muted-foreground">Sections assigned to you for teaching.</p></div>
      {!result.success ? <div className="rounded-lg border border-destructive/30 p-6 text-sm text-destructive">{result.message}</div> : (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.length === 0 ? <p className="text-sm text-muted-foreground">No sections assigned.</p> : sections.map((assignment) => (
            <Link key={assignment.id} href={`/instructor-dashboard/sections/${assignment.section?.id}`} className="rounded-xl border p-5 transition hover:border-primary hover:bg-muted/30">
              <p className="text-xs text-muted-foreground">{assignment.section?.course?.code}</p>
              <h2 className="mt-1 font-semibold">{assignment.section?.course?.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Section {assignment.section?.name} · {assignment.section?.semester?.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorSectionsPage;

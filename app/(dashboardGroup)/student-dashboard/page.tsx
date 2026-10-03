import Link from "next/link";

const StudentDashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Student Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your academic activities from the student dashboard.
        </p>
      </div>
      <Link
        href="/student-dashboard/course-registration"
        className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Open course registration
      </Link>
    </div>
  );
};

export default StudentDashboard;
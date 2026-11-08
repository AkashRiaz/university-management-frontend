import {
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  ShieldCheck,
  CreditCard,
  ClipboardCheck,
  UserCog,
} from "lucide-react";

const features = [
  {
    title: "Student Management",
    description:
      "Manage student profiles, academic programs, departments, admission information, and academic activities from one place.",
    icon: GraduationCap,
  },
  {
    title: "Instructor Management",
    description:
      "Organize instructor information, department assignments, designations, schedules, and academic responsibilities.",
    icon: Users,
  },
  {
    title: "Course Management",
    description:
      "Create courses, connect courses with academic programs, manage sections, and organize semester-based offerings.",
    icon: BookOpen,
  },
  {
    title: "Course Registration",
    description:
      "Students can select available course sections, manage draft registrations, and submit them for administrative approval.",
    icon: ClipboardCheck,
  },
  {
    title: "Payment & Fees",
    description:
      "Manage fee structures, semester invoices, student payments, and payment status before final course registration.",
    icon: CreditCard,
  },
  {
    title: "Role-Based Access",
    description:
      "Provide secure and dedicated access for administrators, students, instructors, registrars, and other university personnel.",
    icon: ShieldCheck,
  },
];

const roles = [
  {
    title: "Admin",
    description:
      "Controls academic setup, students, instructors, courses, programs, semesters, registrations, and system operations.",
    icon: UserCog,
  },
  {
    title: "Student",
    description:
      "Manages personal academic information, selects courses, pays invoices, and submits semester registrations.",
    icon: GraduationCap,
  },
  {
    title: "Instructor",
    description:
      "Accesses assigned academic information, courses, sections, and teaching-related activities.",
    icon: BookOpen,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              University Management System
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Simplifying University
              <span className="block text-primary">Academic Management</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Our University Management System brings students, instructors,
              courses, academic programs, registrations, payments, and
              administrative operations together in one organized platform.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              About The Platform
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              One platform for the complete academic journey
            </h2>

            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                This system is designed to make university operations easier by
                connecting academic and administrative activities through a
                centralized platform.
              </p>

              <p>
                Administrators can configure departments, programs, academic
                years, semesters, courses, sections, fee structures, students,
                and instructors.
              </p>

              <p>
                Students can securely access their accounts, view available
                courses, select course sections, manage semester registrations,
                complete payments, and submit registrations for approval.
              </p>

              <p>
                By keeping academic information connected, the platform reduces
                repetitive work and provides a clearer workflow for both
                students and university staff.
              </p>
            </div>
          </div>

          {/* Flow Card */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
            <h3 className="mb-6 text-xl font-semibold">
              Student Academic Flow
            </h3>

            <div className="space-y-3">
              {[
                "Student Account Created",
                "Student Login",
                "Semester Registration Created",
                "Available Courses Loaded",
                "Course Sections Selected",
                "Semester Invoice Paid",
                "Registration Submitted",
                "Admin Approval",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl border bg-background p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>

                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              What We Manage
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything needed for academic management
            </h2>

            <p className="mt-4 text-muted-foreground">
              The system connects major university activities so that
              information can move smoothly between students, instructors,
              finance, and administration.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border bg-background p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Platform Users
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Built for every part of the university
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <div
                key={role.title}
                className="rounded-2xl border bg-card p-7 text-center shadow-sm"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-semibold">{role.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 pb-20">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground md:px-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <ShieldCheck className="mx-auto mb-5 h-12 w-12" />

            <h2 className="text-3xl font-bold md:text-4xl">Our Mission</h2>

            <p className="mt-5 text-base leading-7 text-primary-foreground/80 md:text-lg">
              Our mission is to create a reliable, secure, and user-friendly
              university management platform that simplifies academic processes,
              improves communication, reduces manual work, and provides students
              and staff with easy access to the information they need.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

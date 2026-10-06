import {
  BookOpen,
  CalendarDays,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  Library,
  MapPin,
  Music,
  Trophy,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";

const campusHighlights = [
  {
    title: "Student Clubs",
    description:
      "Join academic, cultural, technology, debate, sports, and community clubs to connect with students who share your interests.",
    icon: Users,
  },
  {
    title: "Campus Events",
    description:
      "Take part in seminars, workshops, competitions, cultural programs, career events, and university celebrations throughout the year.",
    icon: CalendarDays,
  },
  {
    title: "Library & Study",
    description:
      "Access study spaces, academic resources, course materials, and quiet environments designed to support learning and research.",
    icon: Library,
  },
  {
    title: "Sports & Fitness",
    description:
      "Stay active through sports, tournaments, fitness activities, and recreational programs available for students.",
    icon: Dumbbell,
  },
  {
    title: "Food & Recreation",
    description:
      "Enjoy campus dining, common areas, and recreational spaces where students can relax between classes.",
    icon: Utensils,
  },
  {
    title: "Student Support",
    description:
      "Get academic guidance, administrative assistance, student services, and support throughout your university journey.",
    icon: HeartHandshake,
  },
];

const quickInfo = [
  {
    label: "Academic Community",
    value: "Learn Together",
    icon: GraduationCap,
  },
  {
    label: "Student Activities",
    value: "Stay Connected",
    icon: Music,
  },
  {
    label: "Campus Facilities",
    value: "Study & Grow",
    icon: BookOpen,
  },
  {
    label: "Sports & Clubs",
    value: "Participate",
    icon: Trophy,
  },
];

const facilities = [
  {
    title: "Digital Learning",
    description:
      "Campus-wide access to digital learning tools and online academic resources.",
    icon: Wifi,
  },
  {
    title: "Library",
    description:
      "A dedicated environment for study, research, reading, and academic collaboration.",
    icon: Library,
  },
  {
    title: "Student Spaces",
    description:
      "Common spaces where students can meet, collaborate, relax, and participate in activities.",
    icon: Users,
  },
  {
    title: "Campus Location",
    description:
      "Important campus facilities and academic locations are organized for easy access.",
    icon: MapPin,
  },
];

export default function CampusLifePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-primary" />
              Student Experience
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              More Than Just
              <span className="block text-primary">Academic Life</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Campus life is where learning, friendship, creativity, leadership,
              and personal growth come together. Explore the activities,
              facilities, and experiences that make university life meaningful.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickInfo.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <p className="text-sm text-muted-foreground">{item.label}</p>

                <h3 className="mt-1 text-lg font-semibold">{item.value}</h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Highlights */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Campus Experience
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Discover life beyond the classroom
          </h2>

          <p className="mt-4 text-muted-foreground">
            University life is not only about courses and examinations. Students
            can participate in activities that help develop communication,
            leadership, teamwork, creativity, and confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campusHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-semibold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Student Journey */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                Student Journey
              </p>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Your university experience in one connected environment
              </h2>

              <p className="mt-5 leading-7 text-muted-foreground">
                From attending classes and registering courses to joining clubs
                and taking part in campus activities, students can experience
                both academic and personal development throughout their
                university journey.
              </p>

              <p className="mt-4 leading-7 text-muted-foreground">
                The goal is to create a supportive campus environment where
                students can study, connect with others, participate in
                activities, and prepare for their future careers.
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <div className="space-y-4">
                {[
                  "Attend Classes",
                  "Access Academic Resources",
                  "Meet Other Students",
                  "Join Clubs & Activities",
                  "Participate in Events",
                  "Build Skills & Experience",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-xl border p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-medium">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Campus Facilities
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Spaces designed for student success
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {facilities.map((facility) => {
            const Icon = facility.icon;

            return (
              <div
                key={facility.title}
                className="flex gap-5 rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{facility.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {facility.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Callout */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-12 md:py-16">
          <Users className="mx-auto mb-5 h-12 w-12" />

          <h2 className="text-3xl font-bold md:text-4xl">
            Be Part of the Campus Community
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-primary-foreground/80 md:text-lg">
            University is a place to learn, connect, explore new interests,
            develop skills, and create experiences that go beyond academic
            achievement.
          </p>
        </div>
      </section>
    </main>
  );
}

// Representative data for performance testing of the virtualized lists.
// Only used when a page is opened with `?demo=<count>` (e.g. ?demo=1000), so the
// real backend data and behaviour are never changed. Output is deterministic,
// so every before/after measurement uses exactly the same rows.

const FIRST = ["Rahim", "Karim", "Ayesha", "Fatima", "Tanvir", "Nusrat", "Sabbir", "Farhana", "Imran", "Sadia", "Arif", "Mitu", "Rafi", "Jannat", "Hasan", "Sumaiya"];
const LAST = ["Ahmed", "Hossain", "Islam", "Rahman", "Khan", "Chowdhury", "Akter", "Sarker", "Uddin", "Begum", "Mia", "Talukder"];
const DEPARTMENTS = ["CSE", "EEE", "BBA", "ENG", "CE", "ME"];
const PROGRAMS = ["BSc-CSE", "BSc-EEE", "BBA", "BA-ENG", "BSc-CE", "BSc-ME"];
const STATUSES = ["PRESENT", "PRESENT", "PRESENT", "ABSENT", "LATE", "EXCUSED"];

export const MAX_DEMO_ROWS = 5000;

/** Parses `?demo=` into a safe row count (0 when absent or invalid). */
export function parseDemoCount(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const count = Number(raw);
  if (!Number.isFinite(count) || count <= 0) return 0;
  return Math.min(Math.floor(count), MAX_DEMO_ROWS);
}

const nameAt = (i: number) => `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`;
const emailAt = (i: number) => `${FIRST[i % FIRST.length].toLowerCase()}.${i + 1}@demo.apex.edu`;

export function makeDemoAttendanceStudents(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `demo-attendance-${i + 1}`,
    student: {
      id: `demo-student-${i + 1}`,
      user: { name: nameAt(i), email: emailAt(i) },
      rollNumber: `R-${String(i + 1).padStart(5, "0")}`,
    },
    attendanceRecord: { status: STATUSES[i % STATUSES.length] },
  }));
}

export function makeDemoStudents(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `demo-student-${i + 1}`,
    phone: `01${String(700000000 + i * 37).slice(0, 9)}`,
    admissionYear: 2019 + (i % 7),
    user: { name: nameAt(i), email: emailAt(i) },
    department: { code: DEPARTMENTS[i % DEPARTMENTS.length] },
    program: { code: PROGRAMS[i % PROGRAMS.length] },
    isDemo: true as const,
  }));
}

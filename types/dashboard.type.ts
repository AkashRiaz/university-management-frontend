export type TDashboardAcademicYear = {
  id: string;
  name: string;
};

export type TDashboardSemester = {
  id: string;
  name: string;
  status: string;

  startDate?: string;
  endDate?: string;
  registrationStart?: string;
  registrationEnd?: string;

  academicYear?: TDashboardAcademicYear | null;
};

export type TDashboardDepartment = {
  id: string;
  name: string;
  code: string;
};

export type TDashboardProgram = {
  id: string;
  name: string;
  code: string;
  durationYears?: number | null;
  totalCredits?: number | null;
};

export type TDashboardUser = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
};

export type TAdminDashboardCounts = {
  students: number;
  instructors: number;
  departments: number;
  programs: number;
  courses: number;
  semesters: number;
  registrations: number;
  invoices: number;
};

export type TRegistrationStatusOverview = {
  draft: number;
  pending: number;
  approved: number;
  rejected: number;
};

export type TDashboardFinance = {
  totalInvoices: number;
  totalOutstandingAmount: number;
};

export type TRecentRegistration = {
  id: string;
  registrationNumber: string;
  status: string;
  programSemesterNumber?: number | null;
  createdAt: string;
  updatedAt: string;

  student?: {
    id: string;

    user?: {
      id: string;
      name: string;
      email: string;
    } | null;

    department?: TDashboardDepartment | null;

    program?: {
      id: string;
      name: string;
      code: string;
    } | null;
  } | null;

  semester?: {
    id: string;
    name: string;
    status: string;
  } | null;
};

export type TAdminDashboardOverview = {
  counts: TAdminDashboardCounts;

  registrationStatus: TRegistrationStatusOverview;

  finance: TDashboardFinance;

  currentSemester: TDashboardSemester | null;

  recentRegistrations: TRecentRegistration[];
};

export type TDashboardCourse = {
  id: string;
  code: string;
  title: string;
  credit: number;
  courseType: string;
  courseLevel: string;
};

export type TStudentCourseRegistration = {
  id: string;
  status: string;

  section: {
    id: string;

    course: TDashboardCourse;

    instructor?: {
      id: string;
    } | null;
  };
};

export type TStudentDashboardStudent = {
  id: string;
  studentId?: string;

  user: TDashboardUser;

  department: TDashboardDepartment;

  program: TDashboardProgram;

  currentSemesterNumber?: number | null;
};

export type TStudentDashboardRegistration = {
  id: string;
  registrationNumber: string;
  status: string;
  programSemesterNumber?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type TStudentDashboardInvoice = {
  id: string;

  totalAmount?: number | null;
  paidAmount?: number | null;
  dueAmount?: number | null;

  status?: string | null;

  dueDate?: string | null;
};

export type TStudentDashboardOverview = {
  student: TStudentDashboardStudent;

  currentSemester: TDashboardSemester | null;

  registration: TStudentDashboardRegistration | null;

  courses: {
    count: number;
    totalCredits: number;
    items: TStudentCourseRegistration[];
  };

  invoice: TStudentDashboardInvoice | null;
};

export type AdminDashboardOverviewResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: TAdminDashboardOverview | null;
};

export type StudentDashboardOverviewResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: TStudentDashboardOverview | null;
};

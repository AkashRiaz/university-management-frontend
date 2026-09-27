export type Role =
  | "STUDENT"
  | "INSTRUCTOR"
  | "DEPARTMENT_ADMIN"
  | "REGISTRAR"
  | "FINANCE_ADMIN"
  | "ADMIN"
  | "SUPER_ADMIN";

  export type AuthProvider = "GOOGLE" | "CREDENTIALS";

  export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";

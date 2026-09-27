import { AuthProvider, Role, UserStatus } from "./common.type";


export interface IUser {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: Role;
  status: UserStatus;
  needPasswordChange: boolean;
  imageUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface IUserResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IUser | null;
}



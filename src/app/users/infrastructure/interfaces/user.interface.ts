export interface user {
  id: number;
  fullName: string;
  position: string;
  asfiCredentials: any;
  login: string;
  password: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  mustChangePassword: boolean;
}

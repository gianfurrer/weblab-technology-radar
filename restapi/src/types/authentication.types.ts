export enum Role {
  CTO = "CTO",
  TechLead = "Tech-Lead",
  User = "User",
}

export interface Account {
  id?: string;
  email: string;
  role?: Role;
  password?: string;
}

declare module "express-session" {
  interface SessionData {
    user: Account;
  }
}

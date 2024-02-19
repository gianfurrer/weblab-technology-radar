export enum Role {
  CTO = "CTO",
  TechLead = "Tech-Lead",
  User = "User",
}

export interface User {
  id: string;
  email: string;
  role: Role;
}

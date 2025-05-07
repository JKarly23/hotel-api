export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  RECEPCIONIST = 'recepcionist',
}


declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
    }
  }
}
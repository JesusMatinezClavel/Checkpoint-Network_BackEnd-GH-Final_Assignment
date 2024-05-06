import { Request } from 'express';
import { Express } from 'multer';

export type TokenData = {
  userId: number;
  userName: string;
  roleName: string;
};

declare global {
  namespace Express {
    export interface Request {
      tokenData: TokenData;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    body: MyRequestBodyType | null
    file: Express.Multer.File | null
  }
}

interface MyRequestBodyType {
  name: string | null
  email: string | null
  password: string | null
  birthdate: Date | null
}
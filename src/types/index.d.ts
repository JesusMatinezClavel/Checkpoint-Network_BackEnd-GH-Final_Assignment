export type TokenData = {
    userId: number;
    userName: string;
    roleName: string;
  };
  
  declare global {
    // Express
    namespace Express {
      export interface Request {
        tokenData: TokenData;
      }
    }
  }
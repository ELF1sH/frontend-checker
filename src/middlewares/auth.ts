import { Request, Response } from 'express';

const auth = (req: Request, res: Response, next: any) => {
  next();
};

export default auth;

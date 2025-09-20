import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface RequestExt extends Request {
    user?: string | JwtPayload;
}
declare const checkJwt: (req: RequestExt, res: Response, next: NextFunction) => void;
export { checkJwt };

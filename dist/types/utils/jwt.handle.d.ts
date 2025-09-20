import pkg from "jsonwebtoken";
declare const generateToken: (id: string, email: string) => string;
declare const verifyToken: (jwt: string) => string | pkg.JwtPayload;
export { generateToken, verifyToken };

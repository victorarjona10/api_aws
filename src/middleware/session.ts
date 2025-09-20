import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.handle";
import { JwtPayload } from "jsonwebtoken";

export interface RequestExt extends Request {
    user?: string | JwtPayload;
}

const checkJwt = (req: RequestExt, res: Response, next: NextFunction): void => {
    try {
        const jwtByUser = req.headers.authorization || null;
        const jwt = jwtByUser?.split(' ').pop(); // ['Bearer', '11111'] -> ['11111']
        console.log("Acces token recibido:", jwt);

        const isUser = verifyToken(`${jwt}`);
        
        if (!isUser) {
            console.log("NO_TIENES_UN_JWT_VALIDO");
             res.status(401).send("NO_TIENES_UN_JWT_VALIDO"); // return para evitar llamar a next()
        }
        
        req.user = isUser;
        next(); // Solo si el token es válido, pasa al siguiente middleware
    } catch (e) {
        console.error("Error en checkJwt:", e);
         res.status(401).send("SESSION_NO_VALID"); // Asegúrate de detener con return
    }
};

export { checkJwt };

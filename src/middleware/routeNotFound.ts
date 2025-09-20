import { Request, Response, NextFunction } from 'express';
//Si hacemos una peticion a una ruta que no existe devuelve error
export function routeNotFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Route Not Found: ${req.url}`);
    console.log(error.message);
    res.status(404).json({ error: error.message }); // ojo aqui que si no posem error.message no s'envia l'error!!!
}

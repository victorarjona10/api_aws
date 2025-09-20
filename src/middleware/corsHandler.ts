import { Request, Response, NextFunction } from 'express';

export function corsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        res.header('Access-Control-Allow-Origin', req.header('origin') || '*');// Origenes de los cuales podemos recivir solicitudes
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //accepted headers
        res.header('Access-Control-Allow-Credentials', 'true') //permite que el navegador incluya credenciales (como cookies, cabeceras de autorización o certificados TLS) en las solicitudes CORS

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            res.status(200).json({});
            return;
        }
        next();
    } catch (error) {
        console.error('Error in CORS handler:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

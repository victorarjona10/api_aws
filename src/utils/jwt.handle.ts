import pkg from "jsonwebtoken";
const { sign, verify } = pkg;   //Importamos las funciones sign y verify de la librería jsonwebtoken
const JWT_SECRET = process.env.JWT_SECRET || "token.010101010101"; //Definimos una constante JWT_SECRET que contiene la clave secreta para firmar el token. Si no está definida en las variables de entorno, se le asigna un valor por defecto.
//Esta clave secreta debe ser mantenida en secreto y no debe ser expuesta públicamente.

//No debemos pasar información sensible en el payload, en este caso vamos a pasar como parametro el ID del usuario
const generateToken = (id:string, email: string) => {
    const jwt = sign({id, email}, JWT_SECRET, {expiresIn: '1500s'});
    return jwt;
};

const verifyToken = (jwt: string) => {
    const isOk = verify(jwt, JWT_SECRET);
    return isOk;

};

export { generateToken, verifyToken };

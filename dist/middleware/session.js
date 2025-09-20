"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const jwt_handle_1 = require("../utils/jwt.handle");
const checkJwt = (req, res, next) => {
    try {
        const jwtByUser = req.headers.authorization || null;
        const jwt = jwtByUser === null || jwtByUser === void 0 ? void 0 : jwtByUser.split(' ').pop();
        console.log("Acces token recibido:", jwt);
        const isUser = (0, jwt_handle_1.verifyToken)(`${jwt}`);
        if (!isUser) {
            console.log("NO_TIENES_UN_JWT_VALIDO");
            res.status(401).send("NO_TIENES_UN_JWT_VALIDO");
        }
        req.user = isUser;
        next();
    }
    catch (e) {
        console.error("Error en checkJwt:", e);
        res.status(401).send("SESSION_NO_VALID");
    }
};
exports.checkJwt = checkJwt;
//# sourceMappingURL=session.js.map
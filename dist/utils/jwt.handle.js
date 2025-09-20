"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { sign, verify } = jsonwebtoken_1.default;
const JWT_SECRET = process.env.JWT_SECRET || "token.010101010101";
const generateToken = (id, email) => {
    const jwt = sign({ id, email }, JWT_SECRET, { expiresIn: '1500s' });
    return jwt;
};
exports.generateToken = generateToken;
const verifyToken = (jwt) => {
    const isOk = verify(jwt, JWT_SECRET);
    return isOk;
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.handle.js.map
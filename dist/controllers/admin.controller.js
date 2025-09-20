"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAdmin = postAdmin;
exports.getAllAdmins = getAllAdmins;
exports.getAdminById = getAdminById;
exports.updateAdminById = updateAdminById;
exports.deleteAdminById = deleteAdminById;
exports.loginAdmin = loginAdmin;
exports.refreshAccesToken = refreshAccesToken;
const admin_service_1 = require("../services/admin.service");
const admin_1 = require("../models/admin");
const adminService = new admin_service_1.AdminService();
function postAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const admin = req.body;
            if (!admin.name || !admin.email || !admin.password) {
                res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
                return;
            }
            const newAdmin = yield adminService.postAdmin(admin);
            res.status(201).json(newAdmin);
        }
        catch (error) {
            if (error.message === "El email ya está registrado") {
                res.status(403).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Error al crear el usuario", error });
            }
        }
    });
}
function getAllAdmins(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const admins = yield adminService.getAllAdmins();
            res.status(200).json(admins);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting admins", error });
        }
    });
}
function getAdminById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const admin = yield adminService.getAdminById(id);
            if (!admin) {
                res.status(404).json({ message: "Admin no encontrado" });
                return;
            }
            res.status(200).json(admin);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting admin", error });
        }
    });
}
function updateAdminById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const admin = req.body;
            const updatedAdmin = yield adminService.updateAdminById(id, admin);
            res.status(200).json(updatedAdmin);
        }
        catch (error) {
            if (error.message === "El email ya está registrado") {
                res.status(403).json({ message: error.message });
            }
            else {
                res
                    .status(500)
                    .json({ message: "Error al actualizar el usuario", error });
            }
        }
    });
}
function deleteAdminById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const deletedAdmin = yield adminService.deleteAdminById(id);
            if (!deletedAdmin) {
                res.status(404).json({ message: "Admin no encontrado" });
                return;
            }
            res.status(200).json(deletedAdmin);
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting admin", error });
        }
    });
}
function loginAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: "Email y contraseña son obligatorios" });
                return;
            }
            const admin = yield adminService.loginAdmin(email, password);
            if (!admin) {
                res.status(402).json({ message: "Credenciales inválidas" });
                return;
            }
            res.status(200).json({ message: "Login exitoso", admin });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
function refreshAccesToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ message: "Refresh token es obligatorio" });
            }
            const admin = yield admin_1.AdminModel.findOne({ refreshToken });
            if (!admin) {
                res.status(403).json({ message: "Refresh token inválido" });
                return;
            }
            const { newAccessToken, newRefreshToken } = yield adminService.refreshTokenService(refreshToken);
            res.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken });
        }
        catch (error) {
            res.status(500).json({ message: "Error refreshing access token", error });
        }
    });
}
//# sourceMappingURL=admin.controller.js.map
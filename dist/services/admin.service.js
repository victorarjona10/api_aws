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
exports.AdminService = void 0;
const admin_1 = require("../models/admin");
const bcrypt_handle_1 = require("../utils/bcrypt.handle");
const jwt_handle_1 = require("../utils/jwt.handle");
const bcrypt_handle_2 = require("../utils/bcrypt.handle");
const uuid_1 = require("uuid");
class AdminService {
    postAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!admin.password) {
                    throw new Error("Password is required");
                }
                admin.password = yield (0, bcrypt_handle_2.encrypt)(admin.password);
                const newAdmin = new admin_1.AdminModel(admin);
                return newAdmin.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("El email ya está registrado");
                }
                throw error;
            }
        });
    }
    getAllAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            return admin_1.AdminModel.find();
        });
    }
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return admin_1.AdminModel.findById(id);
        });
    }
    updateAdminById(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (admin.email) {
                    const existingAdmin = yield admin_1.AdminModel.findOne({ email: admin.email });
                    if (existingAdmin && existingAdmin._id.toString() !== id) {
                        throw new Error("El email ya está registrado");
                    }
                }
                return admin_1.AdminModel.findByIdAndUpdate(id, admin, { new: true });
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("El email ya está registrado");
                }
                throw error;
            }
        });
    }
    deleteAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return admin_1.AdminModel.findByIdAndDelete(id);
        });
    }
    loginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield admin_1.AdminModel.findOne({ email });
            if (!admin) {
                throw new Error("Email o contraseña incorrectos");
            }
            const isPasswordValid = yield (0, bcrypt_handle_1.verified)(password, admin.password);
            if (!isPasswordValid) {
                throw new Error("Email o contraseña incorrectos");
            }
            const token = (0, jwt_handle_1.generateToken)(admin.id, admin.email);
            const refreshToken = (0, uuid_1.v4)();
            const refreshTokenExpiry = new Date();
            refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
            admin.refreshToken = refreshToken;
            admin.refreshTokenExpiry = refreshTokenExpiry;
            yield admin.save();
            return { token, user: admin.toObject(), refreshToken };
        });
    }
    refreshTokenService(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield admin_1.AdminModel.findOne({ refreshToken });
            if (!user) {
                throw new Error("Refresh Token inválido");
            }
            if (user.refreshTokenExpiry && new Date() > user.refreshTokenExpiry) {
                throw new Error("Refresh Token caducado");
            }
            const newAccessToken = (0, jwt_handle_1.generateToken)(user.id, user.email);
            const newRefreshToken = (0, uuid_1.v4)();
            const newRefreshTokenExpiry = new Date();
            newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7);
            user.refreshToken = newRefreshToken;
            user.refreshTokenExpiry = newRefreshTokenExpiry;
            yield user.save();
            return { newAccessToken, newRefreshToken };
        });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map
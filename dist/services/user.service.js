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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../models/user");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_handle_1 = require("../utils/bcrypt.handle");
const jwt_handle_1 = require("../utils/jwt.handle");
const bcrypt_handle_2 = require("../utils/bcrypt.handle");
const uuid_1 = require("uuid");
const company_1 = require("../models/company");
class UserService {
    getAllUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            return yield user_1.UserModel.find().skip(skip).limit(limit);
        });
    }
    InactivateUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findByIdAndUpdate(id, { Flag: false }, { new: true });
        });
    }
    ativateUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findByIdAndUpdate(id, { Flag: true }, { new: true });
        });
    }
    getAllActiveUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.find({ Flag: true });
        });
    }
    postUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!user.password) {
                    throw new Error("Password is required");
                }
                user.password = yield (0, bcrypt_handle_2.encrypt)(user.password);
                const newUser = new user_1.UserModel(user);
                return yield newUser.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("El email ya está registrado");
                }
                throw error;
            }
        });
    }
    getUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findOne({ name });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findById(id);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findOne({ email });
        });
    }
    updateUserById(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user.email) {
                    const existingUser = yield user_1.UserModel.findOne({ email: user.email });
                    if (existingUser && existingUser._id.toString() !== id) {
                        throw new Error("El email ya está registrado");
                    }
                }
                return yield user_1.UserModel.findByIdAndUpdate(id, user, { new: true });
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("El email ya está registrado");
                }
                throw error;
            }
        });
    }
    getUsersByFiltration(user, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const filter = Object.fromEntries(Object.entries(user).filter(([_, value]) => value != null));
            const regexFilter = Object.fromEntries(Object.entries(filter).map(([key, value]) => [key, { $regex: new RegExp(value, "i") }]));
            return yield user_1.UserModel.find(regexFilter).skip(skip).limit(limit);
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findOne({ email });
            if (!user) {
                throw new Error("Email o contraseña incorrectos");
            }
            const isPasswordValid = yield (0, bcrypt_handle_1.verified)(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Email o contraseña incorrectos");
            }
            const token = (0, jwt_handle_1.generateToken)(user.id, user.email);
            const refreshToken = (0, uuid_1.v4)();
            const refreshTokenExpiry = new Date();
            refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
            user.refreshToken = refreshToken;
            user.refreshTokenExpiry = refreshTokenExpiry;
            yield user.save();
            return { token, user: user.toObject(), refreshToken };
        });
    }
    refreshTokenService(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findOne({ refreshToken });
            if (!user) {
                console.error("Refresh Token no encontrado en la base de datos.");
                throw new Error("Refresh Token inválido");
            }
            if (user.refreshTokenExpiry && new Date() > user.refreshTokenExpiry) {
                console.error("Refresh Token caducado.");
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
    updateAvatar(avatar, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.UserModel.findOneAndUpdate({ email: email }, { avatar: avatar }, { new: true });
        });
    }
    findOrCreateUserFromGoogle(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!profile.emails || !profile.emails[0]) {
                throw new Error("Google 账号未提供邮箱");
            }
            const email = profile.emails[0].value;
            const existingUser = yield user_1.UserModel.findOne({ email });
            if (existingUser) {
                return existingUser;
            }
            const newUser = new user_1.UserModel({
                name: profile.displayName || "Google User",
                email: email,
                password: yield (0, bcrypt_handle_2.encrypt)((0, uuid_1.v4)()),
                avatar: ((_b = (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || "",
                Flag: true,
                googleId: profile.id,
                phone: 0,
                wallet: 0,
                description: "",
            });
            return yield newUser.save();
        });
    }
    FollowCompany(userId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(userId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            const alreadyFollowed = user.company_Followed.some((company) => company.company_id.toString() === companyId);
            if (alreadyFollowed) {
                throw new Error("Ya sigues esta empresa");
            }
            user.company_Followed.push({ company_id: new mongoose_1.default.Types.ObjectId(companyId) });
            const company = yield company_1.CompanyModel.findById(companyId);
            if (company) {
                company.followers++;
                yield company.save();
            }
            return yield user.save();
        });
    }
    UnfollowCompany(userId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(userId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            const companyIndex = user.company_Followed.findIndex((company) => company.company_id.toString() === companyId);
            if (companyIndex === -1) {
                throw new Error("No sigues esta empresa");
            }
            user.company_Followed.splice(companyIndex, 1);
            const company = yield company_1.CompanyModel.findById(companyId);
            if (company) {
                company.followers--;
                yield company.save();
            }
            return yield user.save();
        });
    }
    getFollowedCompanies(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(userId).populate("company_Followed.company_id");
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            return user.company_Followed.map((company) => {
                if (company.company_id instanceof mongoose_1.default.Types.ObjectId) {
                    throw new Error("Company data is not populated");
                }
                return company.company_id;
            });
        });
    }
    getCompaniesByOwnerId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield company_1.CompanyModel.find({ ownerId: userId });
                if (companies.length === 0) {
                    throw new Error("No se encontraron compañías para este usuario");
                }
                return companies;
            }
            catch (error) {
                console.error("Error al obtener las compañías del usuario:", error);
                throw error;
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
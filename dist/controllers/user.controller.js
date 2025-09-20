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
exports.googleCallback = void 0;
exports.postUser = postUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUserByName = getUserByName;
exports.getUserByEmail = getUserByEmail;
exports.updateUserById = updateUserById;
exports.InactivateUserById = InactivateUserById;
exports.ativateUserById = ativateUserById;
exports.getAllActiveUsers = getAllActiveUsers;
exports.getUsersByFiltration = getUsersByFiltration;
exports.loginUser = loginUser;
exports.refreshAccesToken = refreshAccesToken;
exports.updateAvatar = updateAvatar;
exports.Google = Google;
exports.addFollowed = addFollowed;
exports.UnfollowCompany = UnfollowCompany;
exports.getFollowedCompanies = getFollowedCompanies;
exports.getAllCompanies = getAllCompanies;
const user_service_1 = require("../services/user.service");
const user_1 = require("../models/user");
const uuid_1 = require("uuid");
const jwt_handle_1 = require("../utils/jwt.handle");
const passport_1 = __importDefault(require("passport"));
const userService = new user_service_1.UserService();
function postUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.body;
            if (!user.email || !user.password) {
                res.status(400).json({ message: "Email y contraseña son obligatorios" });
                return;
            }
            const newUser = yield userService.postUser(user);
            res.status(201).json(newUser);
            return;
        }
        catch (error) {
            if (error.code === 11000) {
                res.status(403).json({ message: "El email ya está registrado" });
                return;
            }
            else if (error.name === "ValidationError") {
                res.status(400).json({ message: "Datos inválidos", details: error.errors });
                return;
            }
            else {
                res.status(500).json({ message: "Error al crear el usuario", error: error.message });
                return;
            }
        }
    });
}
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 25;
            const users = yield userService.getAllUsers(page, limit);
            res.status(200).json(users);
            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error getting users", error });
            return;
        }
    });
}
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido getUserById" });
                return;
            }
            const user = yield userService.getUserById(id);
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            res.status(200).json(user);
            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
            return;
        }
    });
}
function getUserByName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const name = req.params.name;
            const user = yield userService.getUserByName(name);
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting user", error });
        }
    });
}
function getUserByEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.params.email;
            const user = yield userService.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting user", error });
        }
    });
}
function updateUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = req.body.user;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido updateUserById" });
                return;
            }
            if (!user.email) {
                res.status(400).json({ message: "El email es obligatorio" });
                return;
            }
            const updatedUser = yield userService.updateUserById(id, user);
            if (!updatedUser) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            res.status(200).json(updatedUser);
        }
        catch (error) {
            if (error.code === 11000) {
                res.status(403).json({ message: "El email ya está registrado" });
                return;
            }
            else {
                res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
                return;
            }
        }
    });
}
function InactivateUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido InactivateUserById" });
            }
            const desactivatedUser = yield userService.InactivateUserById(id);
            if (!desactivatedUser) {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(desactivatedUser);
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting user", error });
        }
    });
}
function ativateUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const activatedUser = yield userService.ativateUserById(id);
            if (!activatedUser) {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(activatedUser);
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting user", error });
        }
    });
}
function getAllActiveUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const activeUsers = yield userService.getAllActiveUsers();
            if (!activeUsers) {
                res.status(404).json({ message: "No hay usuarios activos" });
            }
            res.status(200).json(activeUsers);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting users", error });
        }
    });
}
function getUsersByFiltration(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const users = yield userService.getUsersByFiltration(filters, page, limit);
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting users by filtration", error });
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield userService.loginUser(email, password);
            res.status(200).json(user);
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    });
}
function refreshAccesToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ message: "Refresh token es obligatorio" });
                return;
            }
            const { newAccessToken, newRefreshToken } = yield userService.refreshTokenService(refreshToken);
            res.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken });
        }
        catch (error) {
            if (error.message === "Refresh Token inválido") {
                res.status(410).json({ message: "Refresh token inválido" });
            }
            else if (error.message === "Refresh Token caducado") {
                res.status(401).json({ message: "Refresh token caducado" });
            }
            else {
                console.error("Error al refrescar el token:", error);
                res.status(500).json({ message: "Error interno del servidor", error });
            }
        }
    });
}
function updateAvatar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, avatar } = req.body;
            const updatedAvatar = yield userService.updateAvatar(avatar, email);
            res.status(200).json(updatedAvatar);
            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error refreshing access token", error });
            return;
        }
    });
}
function Google(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const origin = req.query.origin || 'http://localhost:3000';
        const state = JSON.stringify({ origin });
        passport_1.default.authenticate('google', {
            scope: ['profile', 'email'],
            session: false,
            state,
        })(req, res, next);
    });
}
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const state = JSON.parse(req.query.state || '{}');
        const origin = state.origin || 'http://localhost:3000';
        const user = req.user;
        const token = (0, jwt_handle_1.generateToken)(user._id.toString(), user.email);
        const refreshToken = (0, uuid_1.v4)();
        yield user_1.UserModel.findByIdAndUpdate(user._id, { refreshToken });
        res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              token: '${token}',
              refreshToken: '${refreshToken}',
              user: {
                _id: '${user._id}',
                name: '${user.name}',
                email: '${user.email}',
                avatar: '${user.avatar || ''}'
              }
            }, '${origin}');
            window.close();
          </script>
        </body>
      </html>
    `);
    }
    catch (error) {
        console.error('Error en googleCallback:', error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.googleCallback = googleCallback;
function addFollowed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const { companyId } = req.body;
            const updatedUser = yield userService.FollowCompany(userId, companyId);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error("Error in addFollowed:", error);
            res.status(500).json({ message: "Error adding followed", error });
        }
    });
}
function UnfollowCompany(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const { companyId } = req.body;
            const updatedUser = yield userService.UnfollowCompany(userId, companyId);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error("Error in addFollowed:", error);
            res.status(500).json({ message: "Error adding followed", error });
        }
    });
}
function getFollowedCompanies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const followedCompanies = yield userService.getFollowedCompanies(userId);
            res.status(200).json(followedCompanies);
        }
        catch (error) {
            console.error("Error in getFollowedCompanies:", error);
            res.status(500).json({ message: "Error getting followed companies", error });
        }
    });
}
function getAllCompanies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const allCompanies = yield userService.getCompaniesByOwnerId(userId);
            res.status(200).json(allCompanies);
        }
        catch (error) {
            console.error("Error in getFollowedCompanies:", error);
            res.status(500).json({ message: "Error getting followed companies", error });
        }
    });
}
//# sourceMappingURL=user.controller.js.map
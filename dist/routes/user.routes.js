"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_1 = require("../middleware/session");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const router = (0, express_1.Router)();
const user_controller_1 = require("../controllers/user.controller");
const passport_1 = __importDefault(require("passport"));
router.get("/ActiveUsers/", session_1.checkJwt, user_controller_1.getAllActiveUsers);
router.get("/usersByFiltration/", session_1.checkJwt, user_controller_1.getUsersByFiltration);
router.get("/", session_1.checkJwt, user_controller_1.getAllUsers);
router.post("/", user_controller_1.postUser);
router.get('/:id', session_1.checkJwt, user_controller_1.getUserById);
router.get('/name/:name', session_1.checkJwt, user_controller_1.getUserByName);
router.get('/email/:email', session_1.checkJwt, user_controller_1.getUserByEmail);
router.get('/followedCompanies/:id', session_1.checkJwt, user_controller_1.getFollowedCompanies);
router.get('/companies/:id', session_1.checkJwt, user_controller_1.getAllCompanies);
router.put("/updateAvatar", session_1.checkJwt, user_controller_1.updateAvatar);
router.put('/:id', session_1.checkJwt, user_controller_1.updateUserById);
router.put('/InactivateFlag/:id', session_1.checkJwt, user_controller_1.InactivateUserById);
router.put('/ActivateFlag/:id', session_1.checkJwt, user_controller_1.ativateUserById);
router.post("/login", user_controller_1.loginUser);
router.get('/auth/google', user_controller_1.Google);
router.get('/auth/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/api/users/login',
    session: false,
}), user_controller_1.googleCallback);
router.post('/auth/refresh', user_controller_1.refreshAccesToken);
router.put('/follows/:id', user_controller_1.addFollowed);
router.put('/unfollow/:id', user_controller_1.UnfollowCompany);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
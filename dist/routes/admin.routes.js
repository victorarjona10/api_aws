"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const session_1 = require("../middleware/session");
const router = (0, express_1.Router)();
router.post("/", admin_controller_1.postAdmin);
router.get("/", session_1.checkJwt, admin_controller_1.getAllAdmins);
router.get("/:id", session_1.checkJwt, admin_controller_1.getAdminById);
router.put("/:id", session_1.checkJwt, admin_controller_1.updateAdminById);
router.delete("/:id", session_1.checkJwt, admin_controller_1.deleteAdminById);
router.post("/login", admin_controller_1.loginAdmin);
router.post('/auth/refresh', admin_controller_1.refreshAccesToken);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map
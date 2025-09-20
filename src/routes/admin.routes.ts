import { Router } from "express";
import {
  postAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  refreshAccesToken,

} from "../controllers/admin.controller";
import { checkJwt } from "../middleware/session";

const router = Router();



router.post("/",  postAdmin);
router.get("/", checkJwt, getAllAdmins);
router.get("/:id", checkJwt, getAdminById);
router.put("/:id", checkJwt, updateAdminById);
router.delete("/:id", checkJwt, deleteAdminById);
router.post("/login", loginAdmin);
router.post('/auth/refresh', refreshAccesToken);

export default router;

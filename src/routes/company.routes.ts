import { Router } from "express";
import {
  addProductToCompany,
  getCompanyReviews,
  reviewCompany,
  RateCompany,
  postCompany,
  getCompanies,
  getAllCompanies,
  getCompanyById,
  deleteCompanyById,
  updateCompanyById,
  getCompanyWithProductsById,
  getCompanyByName,
  getCompaniesByProductName,
  loginCompany,
  updateCompanyAvatar,
  getPendingOrdersByCompanyId,
  putCompanyPhoto,
  updateCompanyPhotos,

} from "../controllers/company.controller";
import { checkJwt } from "../middleware/session";


const router = Router();

router.get("/companies", checkJwt, getCompanies);
router.get("/", checkJwt, getAllCompanies);

router.get("/search/:search", getCompanyByName);
router.get("/searchProduct/:name", getCompaniesByProductName);
router.get("/pendingOrders/:id", checkJwt, getPendingOrdersByCompanyId);

router.post("/login", loginCompany);
router.put("/updateCompanyAvatar", checkJwt, updateCompanyAvatar);
router.put("/putCompanyPhoto/:id", checkJwt, putCompanyPhoto);
router.put("/updateCompanyPhotos/:id", checkJwt, updateCompanyPhotos);

router.post("/", checkJwt, postCompany);

router.put("/rate/:id", checkJwt, RateCompany);
router.post("/review/:id", checkJwt, reviewCompany);
router.get("/reviews/:id", checkJwt, getCompanyReviews);
router.put("/:id/addProduct", checkJwt, addProductToCompany);
router.get("/:id/products", checkJwt, getCompanyWithProductsById);

router.get("/:id", checkJwt, getCompanyById);
router.put("/:id", checkJwt, updateCompanyById);
router.delete("/:id", checkJwt, deleteCompanyById);
export default router;

import {Router} from 'express';

const router = Router();

import { postProduct, getAllProducts, getProductById, deleteProductById, updateProductById } from '../controllers/product.controller';
router.get("/", getAllProducts);
router.post("/", postProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProductById);
router.delete('/:id', deleteProductById);

export default router;

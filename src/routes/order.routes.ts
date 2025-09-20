import { Router } from 'express';
import { getAllCompanyOrders, postPedido, getPedidoById, deletePedidoById, updateOrderStatus, updatePedidoById, getPedidosByUserId, deleteProductFromOrder} from '../controllers/order.controller';
import { checkJwt } from '../middleware/session';

const router = Router();

router.post("/", checkJwt, postPedido);   
router.get('/:id', checkJwt, getPedidoById);
router.put('/:id', checkJwt, updatePedidoById);
router.put('/updateStatus/:id', checkJwt, updateOrderStatus);
router.delete('/:id', checkJwt, deletePedidoById);
router.get("/AllOrdersByUser/:idUser", checkJwt, getPedidosByUserId);
router.put('/:orderId/:productId', checkJwt, deleteProductFromOrder);
router.get("/AllOrdersByCompany/:idCompany", checkJwt, getAllCompanyOrders);
export default router;



import { Request, Response } from "express";
import { IOrder } from "../models/order";
import { PedidosService } from "../services/order.service";
import { CompanyService } from "../services/company.service";

const pedidosService = new PedidosService();
const companyService = new CompanyService();

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Create a new order
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: The order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error creating order
 */
export async function postPedido(req: Request, res: Response): Promise<void> {
  try {
    const pedido = req.body as IOrder;
    if (!pedido.user_id || !pedido.products || pedido.products.length === 0) {
      res.status(400).json({ message: "User ID, Product ID and quantity are required" });
    }

    const newPedido = await pedidosService.postPedido(pedido);
    await companyService.addPendingOrderToCompany(pedido.company_id.toString(), newPedido._id.toString());
    res.status(200).json(newPedido);
  } catch (error:any) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
}


/**
 * @swagger
 * /api/pedidos/usuario/{idUsuario}:
 *   get:
 *     summary: Get all orders by user ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of all orders by user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error getting orders
 */
export async function getPedidosByUserId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.params.idUser;
    const pedidos = await pedidosService.getPedidosByUserId(userId);
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Error getting orders", error });
  }
}


/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error getting order
 */
export async function getPedidoById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
  }
    const pedido = await pedidosService.getPedidoById(id);
    if (!pedido) {
      res.status(404).json({ message: "Pedido no encontrado" });
  }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ message: "Error getting order", error });
  }
}

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: The updated order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error updating order
 */
export async function updatePedidoById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
  
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }

    const updatedPedido = await pedidosService.updatePedidoById(req.params.id, req.body as IOrder);
    if (!updatedPedido) {
      res.status(404).json({ message: "Pedido no encontrado" });
  }
    res.status(200).json(updatedPedido);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
}

export async function updateOrderStatus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const status = req.body.status;

    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }

    const updatedPedido = await pedidosService.updateOrderStatus(id, status);
    if (!updatedPedido) {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.status(200).json(updatedPedido);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
}


/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The deleted order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error deleting order
 */
export async function deletePedidoById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }

    const deletedPedido = await pedidosService.deletePedidoById(id);
    if (!deletedPedido) {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.status(200).json(deletedPedido);
  } catch (error:any) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
}

export async function deleteProductFromOrder(
  req: Request,
  res: Response
): Promise<void>  {
  try{
    const deleteProduct = await pedidosService.deleteProductFromOrder(req.params.orderId, req.params.productId);
    res.status(200).json(deleteProduct);
  } catch (error) {
    res.status(400).json({ message: "Error updating order", error });
  }
}

export async function getAllCompanyOrders(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const companyId = req.params.idCompany;
    const orders = await pedidosService.getAllCompanyOrders(companyId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error getting orders", error });
  }
}



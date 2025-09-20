import { Request, Response } from "express";
export declare function postPedido(req: Request, res: Response): Promise<void>;
export declare function getPedidosByUserId(req: Request, res: Response): Promise<void>;
export declare function getPedidoById(req: Request, res: Response): Promise<void>;
export declare function updatePedidoById(req: Request, res: Response): Promise<void>;
export declare function deletePedidoById(req: Request, res: Response): Promise<void>;
export declare function deleteProductFromOrder(req: Request, res: Response): Promise<void>;
export declare function getAllCompanyOrders(req: Request, res: Response): Promise<void>;

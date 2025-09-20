import { Request, Response } from 'express';
export declare function postProduct(req: Request, res: Response): Promise<void>;
export declare function getAllProducts(req: Request, res: Response): Promise<void>;
export declare function getProductById(req: Request, res: Response): Promise<void>;
export declare function updateProductById(req: Request, res: Response): Promise<void>;
export declare function deleteProductById(req: Request, res: Response): Promise<void>;

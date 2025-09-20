import { Request, Response } from "express";
export declare function postAdmin(req: Request, res: Response): Promise<void>;
export declare function getAllAdmins(req: Request, res: Response): Promise<void>;
export declare function getAdminById(req: Request, res: Response): Promise<void>;
export declare function updateAdminById(req: Request, res: Response): Promise<void>;
export declare function deleteAdminById(req: Request, res: Response): Promise<void>;
export declare function loginAdmin(req: Request, res: Response): Promise<void>;
export declare function refreshAccesToken(req: Request, res: Response): Promise<void>;

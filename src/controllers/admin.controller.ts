import { Request, Response } from "express";
import { IAdmin } from "../models/admin";
import { AdminService } from "../services/admin.service";
import { AdminModel } from "../models/admin";

const adminService = new AdminService();

export async function postAdmin(req: Request, res: Response): Promise<void> {
  try {
    const admin = req.body as IAdmin;
    if (!admin.name || !admin.email || !admin.password) {
      res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
      return;
    }
    const newAdmin = await adminService.postAdmin(admin);

    res.status(201).json(newAdmin);
  } catch (error: any) {
    if (error.message === "El email ya está registrado") {
      // Enviar una respuesta clara para el error de email duplicado

      res.status(403).json({ message: error.message });

    } else {
      // Manejo genérico de errores
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  }
}

export async function getAllAdmins(req: Request, res: Response): Promise<void> {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error getting admins", error });
  }
}

export async function getAdminById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }
    const admin = await adminService.getAdminById(id);
    if (!admin) {
      res.status(404).json({ message: "Admin no encontrado" });
      return;
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error getting admin", error });
  }
}

export async function updateAdminById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }
    const admin = req.body as IAdmin;
    const updatedAdmin = await adminService.updateAdminById(id, admin);
    res.status(200).json(updatedAdmin);
  } catch (error: any) {
    if (error.message === "El email ya está registrado") {
      // Enviar una respuesta clara para el error de email duplicado

      res.status(403).json({ message: error.message });

    } else {
      // Manejo genérico de errores
      res
        .status(500)
        .json({ message: "Error al actualizar el usuario", error });
    }
  }
}

export async function deleteAdminById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }
    const deletedAdmin = await adminService.deleteAdminById(id);
    if (!deletedAdmin) {
      res.status(404).json({ message: "Admin no encontrado" });
      return;
    }
    res.status(200).json(deletedAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error });
  }
}

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email y contraseña son obligatorios" });
      return;
    }
    const admin = await adminService.loginAdmin(email, password);
    if (!admin) {
      res.status(402).json({ message: "Credenciales inválidas" });
      return;
    }
  
    res.status(200).json({ message: "Login exitoso", admin });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function refreshAccesToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token es obligatorio" });
    }
    const admin = await AdminModel.findOne({ refreshToken });
    if (!admin) {
      res.status(403).json({ message: "Refresh token inválido" });
      return;
    }
    const { newAccessToken, newRefreshToken } = await adminService.refreshTokenService(refreshToken);

    res.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken  });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing access token", error });
  }
}





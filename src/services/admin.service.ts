import { IAdmin, AdminModel } from "../models/admin";
import { verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";
import {encrypt} from "../utils/bcrypt.handle";
import { v4 as uuidv4 } from "uuid";
export class AdminService {
  async postAdmin(admin: Partial<IAdmin>): Promise<IAdmin> {
    try {
      if (!admin.password) {
        throw new Error("Password is required");
      }
      admin.password = await encrypt(admin.password); // Asegúrate de que admin.password no sea undefined
      const newAdmin = new AdminModel(admin);

      return newAdmin.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado");
      }
      throw error;
    }

  } 
  


  async getAllAdmins(): Promise<IAdmin[]> {
    return AdminModel.find();
  }

  async getAdminById(id: string): Promise<IAdmin | null> {
    return AdminModel.findById(id);
  }

  async updateAdminById(id: string, admin: IAdmin): Promise<IAdmin | null> {
    try {
      if (admin.email) {
        // Buscar si ya existe un usuario con este email
        const existingAdmin = await AdminModel.findOne({ email: admin.email });

        // Si se encuentra un usuario con el mismo email y su ID no coincide
        if (existingAdmin && existingAdmin._id.toString() !== id) {
          throw new Error("El email ya está registrado");
        }
      }
      return AdminModel.findByIdAndUpdate(id, admin, { new: true });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado");
      }
      throw error;
    }
  }

  async deleteAdminById(id: string): Promise<IAdmin | null> {
    return AdminModel.findByIdAndDelete(id);
  }


  async loginAdmin(email: string, password: string): Promise<{ token: string; user: IAdmin, refreshToken: string }> {

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      throw new Error("Email o contraseña incorrectos");
    }


    const isPasswordValid = await verified(password, admin.password); // Compara el hash de la contraseña almacenada con la contraseña proporcionada
    //Esto solo funciona si la contraseña se ha almacenado como un hash en la base de datos.

    if (!isPasswordValid) {
      throw new Error("Email o contraseña incorrectos");
    }

    const token = generateToken(admin.id, admin.email);
    const refreshToken = uuidv4(); // Genera un nuevo refresh token
    const refreshTokenExpiry = new Date(); // Fecha de expiración
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // Expira en 7 días

    admin.refreshToken = refreshToken; // Almacena el refresh token en la base de datos
    admin.refreshTokenExpiry = refreshTokenExpiry; // Almacena la fecha de expiración en la base de datos
    await admin.save(); // Guarda los cambios en la base de datos

    return { token, user: admin.toObject() as IAdmin, refreshToken };

  }

  async refreshTokenService(refreshToken: string): Promise<{ newAccessToken: string, newRefreshToken: string }> {
    const user = await AdminModel.findOne({ refreshToken });
    if (!user) {
        throw new Error("Refresh Token inválido");
    }

    // Verificar si el Refresh Token ha caducado
    if (user.refreshTokenExpiry && new Date() > user.refreshTokenExpiry) {
        throw new Error("Refresh Token caducado");
    }
    // Generar un nuevo Access Token y Refresh Token
    const newAccessToken = generateToken(user.id ,user.email);
    const newRefreshToken = uuidv4();
    const newRefreshTokenExpiry = new Date();
    newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7); // Expira en 7 días

    // Actualizar el Refresh Token en la base de datos
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiry = newRefreshTokenExpiry;
    await user.save();

    return { newAccessToken, newRefreshToken };
}

}

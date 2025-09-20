import { IUser, UserModel } from "../models/user";
import mongoose from "mongoose";
import { verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";
import {encrypt} from "../utils/bcrypt.handle";
import { v4 as uuidv4 } from "uuid";
import { ICompany, CompanyModel } from "../models/company";

import { Profile } from "passport-google-oauth20";


export class UserService {

  async getAllUsers(page: number, limit: number): Promise<IUser[]> {
    const skip = (page - 1) * limit;
    return await UserModel.find().skip(skip).limit(limit);
  }

  async InactivateUserById(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { Flag: false },
      { new: true }
    );
  }

  async ativateUserById(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, { Flag: true }, { new: true });
  }

  async getAllActiveUsers(): Promise<IUser[]> {
    return await UserModel.find({ Flag: true });
  }
    async postUser(user: Partial<IUser>): Promise<IUser> {
        try {
            if (!user.password) {
                throw new Error("Password is required");
            }
        user.password = await encrypt(user.password); // Asegúrate de que user.password no sea undefined
        const newUser = new UserModel(user);
        return await newUser.save();
        }
        catch (error: any) {
            if (error.code === 11000) {
                throw new Error("El email ya está registrado");
            }
            throw error;
        }
    }

    async getUserByName(name: string): Promise<IUser | null> {
        return await UserModel.findOne({ name });
    }

    async getUserById(id: string): Promise<IUser | null>{
        return await UserModel.findById(id);
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async updateUserById(id: string, user: Partial<IUser>): Promise<IUser | null> {
        try{
            if (user.email) {
                // Buscar si ya existe un usuario con este email
                const existingUser = await UserModel.findOne({ email: user.email });
    
                // Si se encuentra un usuario con el mismo email y su ID no coincide
                if (existingUser && existingUser._id.toString() !== id) {
                    throw new Error("El email ya está registrado");
                }
            }           
            return await UserModel.findByIdAndUpdate(id, user, {new: true});
        }
        catch (error: any) {
            if (error.code === 11000) {
                throw new Error("El email ya está registrado");
            }
            throw error;
        }
    }

    
    
    async getUsersByFiltration(user : Partial<IUser>, page: number, limit: number): Promise<IUser[]> {
        const skip = (page - 1) * limit;
        
        // Eliminar campos nulos o indefinidos del objeto users
        const filter: Partial<IUser> = Object.fromEntries(
        Object.entries(user).filter(([_, value]) => value != null)
        );

        // Convertir los valores de los campos en expresiones regulares para búsqueda parcial
        const regexFilter: Partial<IUser> = Object.fromEntries(
        Object.entries(filter).map(([key, value]) => [key, { $regex: new RegExp(value as string, "i") }])
        );


        return await UserModel.find(regexFilter).skip(skip).limit(limit);
    }


  async loginUser(email: string, password: string): Promise<{ token: string; user: IUser, refreshToken: string }> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Email o contraseña incorrectos");
    }

    // Comparación directa de contraseñas
    const isPasswordValid = await verified(password, user.password); 
    if (!isPasswordValid) {
      throw new Error("Email o contraseña incorrectos");
    }

    const token = generateToken(user.id, user.email);
    const refreshToken = uuidv4(); // Genera un nuevo refresh token
    const refreshTokenExpiry = new Date(); // Fecha de expiración
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // Expira en 7 días
    
    user.refreshToken = refreshToken; // Almacena el refresh token en el usuario
    user.refreshTokenExpiry = refreshTokenExpiry; // Almacena la fecha de expiración del refresh token
    await user.save(); // Guarda los cambios en la base de datos

    return { token, user: user.toObject() as IUser, refreshToken };
    //return { token, refreshToken };
  }


  async refreshTokenService(refreshToken: string): Promise<{ newAccessToken: string, newRefreshToken: string }> {
    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      console.error("Refresh Token no encontrado en la base de datos.");
      throw new Error("Refresh Token inválido");
    }
  
    // Verificar si el Refresh Token ha caducado
    if (user.refreshTokenExpiry && new Date() > user.refreshTokenExpiry) {
      console.error("Refresh Token caducado.");
      throw new Error("Refresh Token caducado");
    }
  

  
    // Generar un nuevo Access Token y Refresh Token
    const newAccessToken = generateToken(user.id, user.email);
    const newRefreshToken = uuidv4();
    const newRefreshTokenExpiry = new Date();
    newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7); // Expira en 7 días
  
    // Actualizar el Refresh Token en la base de datos
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiry = newRefreshTokenExpiry;
    await user.save();
  
  
    return { newAccessToken, newRefreshToken };
  }

  async updateAvatar( avatar:string, email: string): Promise<IUser | null>{
    return await UserModel.findOneAndUpdate({email:email}, { avatar: avatar }, { new: true });
  }
  // ============== Google 登录专用方法 ==============
  async findOrCreateUserFromGoogle(profile: Profile): Promise<IUser> {
    if (!profile.emails || !profile.emails[0]) {
      throw new Error("Google 账号未提供邮箱");
    }

    const email = profile.emails[0].value;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return existingUser;
    }

    const newUser = new UserModel({
      name: profile.displayName || "Google User",
      email: email,
      password: await encrypt(uuidv4()), // Genera una contraseña aleatoria
      avatar: profile.photos?.[0]?.value || "",
      Flag: true,
      googleId: profile.id, 
      phone: 0, 
      wallet: 0,
      description: "",

    });



    return await newUser.save();
  }

  async FollowCompany(userId: string, companyId: string): Promise<IUser | null> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const alreadyFollowed = user.company_Followed.some(
      (company) => company.company_id.toString() === companyId
    );

    if (alreadyFollowed) {
      throw new Error("Ya sigues esta empresa");
    }
    
      
    user.company_Followed.push({ company_id: new mongoose.Types.ObjectId(companyId) });

    const company = await CompanyModel.findById(companyId);
    if (company) {
      company.followers++;
      await company.save();
    }
    return await user.save();
    
  }

  async UnfollowCompany(userId: string, companyId: string): Promise<IUser | null> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const companyIndex = user.company_Followed.findIndex(
      (company) => company.company_id.toString() === companyId
    );

    if (companyIndex === -1) {
      throw new Error("No sigues esta empresa");
    }

    user.company_Followed.splice(companyIndex, 1);
    const company = await CompanyModel.findById(companyId);
    if (company) {
      company.followers--;
      await company.save();
    }
    return await user.save();
  }
  //funcion para obtener la lista de empresas seguidas por el usuario
  async  getFollowedCompanies(userId: string): Promise<ICompany[]> {
    const user = await UserModel.findById(userId).populate("company_Followed.company_id");
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user.company_Followed.map((company) => {
        if (company.company_id instanceof mongoose.Types.ObjectId) {
            throw new Error("Company data is not populated");
        }
        return company.company_id as ICompany;
    });
}

async getCompaniesByOwnerId(userId: string): Promise<ICompany[]> {
  try {
    // Buscar todas las compañías cuyo ownerId coincida con el userId proporcionado
    const companies = await CompanyModel.find({ ownerId: userId });
    if (companies.length === 0) {
      throw new Error("No se encontraron compañías para este usuario");
    }
    return companies;
  } catch (error) {
    console.error("Error al obtener las compañías del usuario:", error);
    throw error;
  }
}

}
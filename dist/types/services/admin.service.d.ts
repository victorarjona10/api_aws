import { IAdmin } from "../models/admin";
export declare class AdminService {
    postAdmin(admin: Partial<IAdmin>): Promise<IAdmin>;
    getAllAdmins(): Promise<IAdmin[]>;
    getAdminById(id: string): Promise<IAdmin | null>;
    updateAdminById(id: string, admin: IAdmin): Promise<IAdmin | null>;
    deleteAdminById(id: string): Promise<IAdmin | null>;
    loginAdmin(email: string, password: string): Promise<{
        token: string;
        user: IAdmin;
        refreshToken: string;
    }>;
    refreshTokenService(refreshToken: string): Promise<{
        newAccessToken: string;
        newRefreshToken: string;
    }>;
}

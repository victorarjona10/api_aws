import { IUser } from "../models/user";
import { ICompany } from "../models/company";
import { Profile } from "passport-google-oauth20";
export declare class UserService {
    getAllUsers(page: number, limit: number): Promise<IUser[]>;
    InactivateUserById(id: string): Promise<IUser | null>;
    ativateUserById(id: string): Promise<IUser | null>;
    getAllActiveUsers(): Promise<IUser[]>;
    postUser(user: Partial<IUser>): Promise<IUser>;
    getUserByName(name: string): Promise<IUser | null>;
    getUserById(id: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    updateUserById(id: string, user: Partial<IUser>): Promise<IUser | null>;
    getUsersByFiltration(user: Partial<IUser>, page: number, limit: number): Promise<IUser[]>;
    loginUser(email: string, password: string): Promise<{
        token: string;
        user: IUser;
        refreshToken: string;
    }>;
    refreshTokenService(refreshToken: string): Promise<{
        newAccessToken: string;
        newRefreshToken: string;
    }>;
    updateAvatar(avatar: string, email: string): Promise<IUser | null>;
    findOrCreateUserFromGoogle(profile: Profile): Promise<IUser>;
    FollowCompany(userId: string, companyId: string): Promise<IUser | null>;
    UnfollowCompany(userId: string, companyId: string): Promise<IUser | null>;
    getFollowedCompanies(userId: string): Promise<ICompany[]>;
    getCompaniesByOwnerId(userId: string): Promise<ICompany[]>;
}

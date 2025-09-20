import { ICompany } from "../models/company";
import { IReview } from "../models/review";
import { IOrder } from "../models/order";
export declare class CompanyService {
    postCompany(company: Partial<ICompany>): Promise<ICompany>;
    getAllCompanies(): Promise<ICompany[]>;
    getCompanyById(id: string): Promise<ICompany | null>;
    updateCompanyById(id: string, company: ICompany): Promise<ICompany | null>;
    deleteCompanyById(id: string): Promise<ICompany | null>;
    getCompanyWithProductsById(id: string): Promise<ICompany | null>;
    RateCompany(id: string, rating: number): Promise<ICompany | null>;
    reviewCompany(review: Partial<IReview>): Promise<IReview | null>;
    getCompanyReviews(companyId: string): Promise<IReview[]>;
    addProductToCompany(companyId: string, productId: string): Promise<ICompany | null>;
    getCompanyByName(text: string): Promise<ICompany[]>;
    getCompaniesByProductName(productName: string): Promise<ICompany[]>;
    loginCompany(email: string, password: string): Promise<{
        company: ICompany;
    }>;
    updateAvatar(avatar: string, email: string): Promise<ICompany | null>;
    addPendingOrderToCompany(companyId: string, orderId: string): Promise<ICompany | null>;
    getPendingOrdersByCompanyId(companyId: string): Promise<IOrder[] | null>;
}

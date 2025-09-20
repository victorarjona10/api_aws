import { IProduct } from '../models/product';
export declare class ProductService {
    postProduct(product: Partial<IProduct>): Promise<IProduct>;
    getAllProducts(): Promise<IProduct[]>;
    getProductById(id: string): Promise<IProduct | null>;
    updateProductById(id: string, product: IProduct): Promise<IProduct | null>;
    deleteProductById(id: string): Promise<IProduct | null>;
}

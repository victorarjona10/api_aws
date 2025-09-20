
import { IProduct, ProductModel } from '../models/product';

export class ProductService {
    async postProduct(product: Partial<IProduct>): Promise<IProduct> {
        const newProduct = new ProductModel(product);
        return newProduct.save();
    }

    

    async getAllProducts(): Promise<IProduct[]> {
        return ProductModel.find();
    }

    async getProductById(id: string): Promise<IProduct | null> {
        return ProductModel.findById(id);
    }

    async updateProductById(id: string, product: IProduct): Promise<IProduct | null> {
        return ProductModel.findByIdAndUpdate(id, product, { new: true });
    }

    async deleteProductById(id: string): Promise<IProduct | null> {
        return ProductModel.findByIdAndDelete(id);
    }

}
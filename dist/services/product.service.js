"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_1 = require("../models/product");
class ProductService {
    postProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = new product_1.ProductModel(product);
            return newProduct.save();
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return product_1.ProductModel.find();
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_1.ProductModel.findById(id);
        });
    }
    updateProductById(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_1.ProductModel.findByIdAndUpdate(id, product, { new: true });
        });
    }
    deleteProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_1.ProductModel.findByIdAndDelete(id);
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map
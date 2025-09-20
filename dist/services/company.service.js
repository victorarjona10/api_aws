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
exports.CompanyService = void 0;
const company_1 = require("../models/company");
const review_1 = require("../models/review");
const product_1 = require("../models/product");
const bcrypt_handle_1 = require("../utils/bcrypt.handle");
const order_1 = require("../models/order");
class CompanyService {
    postCompany(company) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                const newCompany = new company_1.CompanyModel(Object.assign(Object.assign({}, company), { rating: (_a = company.rating) !== null && _a !== void 0 ? _a : 0, userRatingsTotal: (_b = company.userRatingsTotal) !== null && _b !== void 0 ? _b : 0, products: (_c = company.products) !== null && _c !== void 0 ? _c : [], reviews: (_d = company.reviews) !== null && _d !== void 0 ? _d : [], wallet: (_e = company.wallet) !== null && _e !== void 0 ? _e : 0, followers: (_f = company.followers) !== null && _f !== void 0 ? _f : 0, photos: (_g = company.photos) !== null && _g !== void 0 ? _g : [], icon: (_h = company.icon) !== null && _h !== void 0 ? _h : "https://res.cloudinary.com/dqj8xgq4h/image/upload/v1697060982/CompanyIcon_1_ojzv5c.png" }));
                if (!company.password) {
                    throw new Error("Password is required");
                }
                newCompany.password = yield (0, bcrypt_handle_1.encrypt)(company.password);
                return newCompany.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("El email ya está registrado");
                }
                throw error;
            }
        });
    }
    getAllCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            return company_1.CompanyModel.find().populate("products").exec();
        });
    }
    getCompanyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return company_1.CompanyModel.findById(id);
        });
    }
    updateCompanyById(id, company) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (company.email) {
                    const existingCompany = yield company_1.CompanyModel.findOne({
                        email: company.email,
                    });
                    if (existingCompany && existingCompany._id.toString() !== id) {
                        throw new Error("El email ya está registrado");
                    }
                }
                return company_1.CompanyModel.findByIdAndUpdate(id, company, { new: true });
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("El email ya está registrado");
                }
                throw error;
            }
        });
    }
    deleteCompanyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return company_1.CompanyModel.findByIdAndDelete(id);
        });
    }
    getCompanyWithProductsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return company_1.CompanyModel.findById(id).populate("products").exec();
        });
    }
    RateCompany(id, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield company_1.CompanyModel.findById(id);
            if (!company) {
                throw new Error("Company not found");
            }
            const newRating = (company.rating * company.userRatingsTotal + rating) /
                (company.userRatingsTotal + 1);
            company.rating = newRating;
            company.userRatingsTotal += 1;
            return company.save();
        });
    }
    reviewCompany(review) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!review.user_id || !review.company_id || review.rating === undefined) {
                throw new Error("Faltan datos obligatorios para crear o actualizar la reseña");
            }
            if (!review._id) {
                delete review._id;
            }
            const company = yield company_1.CompanyModel.findById(review.company_id);
            if (!company) {
                throw new Error("Company not found");
            }
            const existingReview = yield review_1.ReviewModel.findOne({
                user_id: review.user_id,
                company_id: review.company_id,
            });
            if (existingReview) {
                const updatedReview = yield review_1.ReviewModel.findByIdAndUpdate(existingReview._id, review, { new: true });
                if (!updatedReview) {
                    throw new Error("Error al actualizar la reseña");
                }
                const updatedRating = parseFloat(((company.rating * company.userRatingsTotal -
                    existingReview.rating +
                    review.rating) /
                    company.userRatingsTotal).toFixed(2));
                company.rating = updatedRating;
                company.reviews = (_a = company.reviews) === null || _a === void 0 ? void 0 : _a.map((r) => r.toString() === existingReview._id.toString() ? updatedReview._id : r);
                yield company.save();
                return updatedReview;
            }
            else {
                const newReview = new review_1.ReviewModel(review);
                (_b = company.reviews) === null || _b === void 0 ? void 0 : _b.push(newReview._id);
                company.rating = parseFloat(((company.rating * company.userRatingsTotal + review.rating) /
                    (company.userRatingsTotal + 1)).toFixed(2));
                company.userRatingsTotal += 1;
                yield company.save();
                return newReview.save();
            }
        });
    }
    getCompanyReviews(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!companyId || companyId.length !== 24) {
                throw new Error("ID inválido");
            }
            yield review_1.ReviewModel.find({ company_id: companyId })
                .populate("user_id")
                .exec();
            return review_1.ReviewModel.find({ company_id: companyId })
                .populate("user_id")
                .exec();
        });
    }
    addProductToCompany(companyId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield company_1.CompanyModel.findById(companyId);
                if (!company) {
                    throw new Error("Empresa no encontrada");
                }
                const product = yield product_1.ProductModel.findById(productId);
                if (!product) {
                    throw new Error("Producto no encontrado");
                }
                if (company.products.some((p) => p.toString() === productId)) {
                    throw new Error("El producto ya está asociado a esta empresa");
                }
                company.products.push(product._id);
                return yield company.save();
            }
            catch (error) {
                console.error("Error al añadir producto a la empresa:", error);
                throw error;
            }
        });
    }
    getCompanyByName(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchedCompanies = yield company_1.CompanyModel.find({ $text: { $search: text } }).exec();
                return matchedCompanies;
            }
            catch (error) {
                console.error("Error al buscar compañías:", error);
                throw new Error("No se pudieron buscar las compañías");
            }
        });
    }
    getCompaniesByProductName(productName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchedProducts = yield product_1.ProductModel.find({
                    $text: { $search: productName },
                }).exec();
                const companyIds = matchedProducts.map((product) => product.companyId);
                const uniqueCompanyIds = [...new Set(companyIds)];
                const companies = yield company_1.CompanyModel.find({ _id: { $in: uniqueCompanyIds } }).exec();
                return companies;
            }
            catch (error) {
                console.error("Error al buscar empresas por nombre de producto:", error);
                throw new Error("No se pudieron buscar las empresas");
            }
        });
    }
    loginCompany(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield company_1.CompanyModel.findOne({ email });
            if (!company) {
                throw new Error("Email o contraseña incorrectos");
            }
            const isPasswordValid = yield (0, bcrypt_handle_1.verified)(password, company.password);
            if (!isPasswordValid) {
                throw new Error("Email o contraseña incorrectos");
            }
            return { company: company.toObject() };
        });
    }
    updateAvatar(avatar, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield company_1.CompanyModel.findOneAndUpdate({ email: email }, { icon: avatar }, { new: true });
        });
    }
    addPendingOrderToCompany(companyId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield company_1.CompanyModel.findById(companyId);
                if (!company) {
                    throw new Error("Company not found");
                }
                if (!company.pendingOrders) {
                    company.pendingOrders = [];
                }
                const order = yield order_1.OrderModel.findById(orderId);
                if (!order) {
                    throw new Error("Order not found");
                }
                company.pendingOrders.push(order._id);
                console.log("Pending orders", company.pendingOrders);
                return yield company.save();
            }
            catch (error) {
                console.error("Error al añadir pedido pendiente a la empresa:", error);
                throw error;
            }
        });
    }
    getPendingOrdersByCompanyId(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const company = yield company_1.CompanyModel.findById(companyId).populate("pendingOrders");
                if (!company) {
                    throw new Error("Company not found");
                }
                return ((_a = company.pendingOrders) !== null && _a !== void 0 ? _a : []);
            }
            catch (error) {
                console.error("Error al obtener pedidos pendientes de la empresa:", error);
                throw error;
            }
        });
    }
}
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map
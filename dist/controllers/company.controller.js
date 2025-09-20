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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCompany = postCompany;
exports.getAllCompanies = getAllCompanies;
exports.getCompanyById = getCompanyById;
exports.updateCompanyById = updateCompanyById;
exports.deleteCompanyById = deleteCompanyById;
exports.getCompanyWithProductsById = getCompanyWithProductsById;
exports.getCompanies = getCompanies;
exports.RateCompany = RateCompany;
exports.reviewCompany = reviewCompany;
exports.getCompanyReviews = getCompanyReviews;
exports.addProductToCompany = addProductToCompany;
exports.getCompanyByName = getCompanyByName;
exports.getCompaniesByProductName = getCompaniesByProductName;
exports.loginCompany = loginCompany;
exports.updateCompanyAvatar = updateCompanyAvatar;
exports.getPendingOrdersByCompanyId = getPendingOrdersByCompanyId;
const company_service_1 = require("../services/company.service");
const axios_1 = __importDefault(require("axios"));
const companyService = new company_service_1.CompanyService();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function postCompany(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const company = req.body;
            if (!company.name || !company.email || !company.password) {
                res
                    .status(400)
                    .json({ message: "Nombre, email y contraseña son obligatorios" });
                return;
            }
            if (!company.ownerId) {
                res.status(400).json({ message: "El id del propietario es obligatorio" });
                return;
            }
            const newCompany = yield companyService.postCompany(company);
            res.status(200).json(newCompany);
            return;
        }
        catch (error) {
            if (error.code === 11000) {
                res.status(403).json({ message: "El email ya está registrado" });
                return;
            }
            else {
                res
                    .status(500)
                    .json({ message: "Error al crear la empresa", error: error.message });
                return;
            }
        }
    });
}
function getAllCompanies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const companies = yield companyService.getAllCompanies();
            res.status(200).json(companies);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting companies", error });
        }
    });
}
function getCompanyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const company = yield companyService.getCompanyById(id);
            if (!company) {
                res.status(404).json({ message: "Empresa no encontrada" });
                return;
            }
            res.status(200).json(company);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting company", error });
        }
    });
}
function updateCompanyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const company = req.body;
            const updatedCompany = yield companyService.updateCompanyById(id, company);
            if (!updatedCompany) {
                res.status(404).json({ message: "Empresa no encontrada" });
                return;
            }
            res.status(200).json(updatedCompany);
            return;
        }
        catch (error) {
            if (error.message === "El email ya está registrado") {
                res.status(403).json({ message: error.message });
                return;
            }
            else {
                res
                    .status(500)
                    .json({ message: "Error al actualizar el usuario", error });
            }
        }
    });
}
function deleteCompanyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const deletedCompany = yield companyService.deleteCompanyById(id);
            if (!deletedCompany) {
                res.status(404).json({ message: "Empresa no encontrada" });
                return;
            }
            res.status(200).json(deletedCompany);
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting company", error });
        }
    });
}
function getCompanyWithProductsById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const company = yield companyService.getCompanyWithProductsById(id);
            if (!company) {
                throw new Error("Company not found");
            }
            res.status(200).json(company);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error getting company with products", error });
        }
    });
}
function getCompanies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        try {
            const query = req.query.query || "Carrefour";
            const lat = parseFloat(req.query.lat) || 41.2804038;
            const lng = parseFloat(req.query.lng) || 1.9848002;
            const radius = parseInt(req.query.radius) || 300;
            const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
            const response = yield axios_1.default.get(url, {
                params: {
                    query: query,
                    location: `${lat},${lng}`,
                    radius: radius,
                    key: GOOGLE_API_KEY,
                },
            });
            const data = response.data;
            const results = data.results.map((place) => {
                var _a, _b;
                return ({
                    name: place.name,
                    address: place.formatted_address,
                    location: ((_a = place.geometry) === null || _a === void 0 ? void 0 : _a.location)
                        ? {
                            lat: place.geometry.location.lat,
                            lng: place.geometry.location.lng,
                        }
                        : null,
                    rating: place.rating,
                    userRatingsTotal: place.user_ratings_total,
                    placeId: place.place_id,
                    types: place.types,
                    openingHours: place.opening_hours,
                    photos: (_b = place.photos) === null || _b === void 0 ? void 0 : _b.map((photo) => ({
                        photoReference: photo.photo_reference,
                        width: photo.width,
                        height: photo.height,
                    })),
                    priceLevel: place.price_level,
                    businessStatus: place.business_status,
                    icon: place.icon,
                    vicinity: place.vicinity,
                    plusCode: place.plus_code,
                });
            });
            res.status(200).json(results);
        }
        catch (error) {
            console.error("Error al obtener lugares:");
            res.status(500).json({ error: "Error al obtener lugares" });
        }
    });
}
function RateCompany(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const { rating } = req.body;
            const updatedCompany = yield companyService.RateCompany(id, rating);
            if (!updatedCompany) {
                res.status(404).json({ message: "Empresa no encontrada" });
                return;
            }
            res.status(200).json(updatedCompany);
        }
        catch (error) {
            res.status(500).json({ message: "Error al calificar la empresa", error });
        }
    });
}
function reviewCompany(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const review = req.body.review;
            if (!review.user_id || !review.company_id || review.rating === undefined) {
                console.error("Faltan datos obligatorios para crear o actualizar la reseña:", review);
                res
                    .status(400)
                    .json({
                    message: "Faltan datos obligatorios para crear o actualizar la reseña",
                });
                return;
            }
            const newReview = yield companyService.reviewCompany(review);
            res.status(200).json(newReview);
            return;
        }
        catch (error) {
            console.error("Error en reviewCompany:", error);
            res
                .status(500)
                .json({ message: "Error al crear o actualizar la reseña", error });
            return;
        }
    });
}
function getCompanyReviews(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const reviews = yield companyService.getCompanyReviews(id);
            if (!reviews) {
                res.status(404).json({ message: "Reseñas no encontradas" });
                return;
            }
            console.log("Reseñas obtenidas:", reviews);
            res.status(200).json(reviews);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error al obtener las reseñas de la empresa", error });
            return;
        }
    });
}
function addProductToCompany(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const companyId = req.params.id;
            const { productId } = req.body;
            if (!companyId || companyId.length !== 24) {
                res.status(400).json({ message: "ID de empresa inválido" });
                return;
            }
            if (!productId || productId.length !== 24) {
                res.status(400).json({ message: "ID de producto inválido" });
                return;
            }
            const updatedCompany = yield companyService.addProductToCompany(companyId, productId);
            res.status(200).json(updatedCompany);
        }
        catch (error) {
            if (error.message === "Empresa no encontrada" ||
                error.message === "Producto no encontrado") {
                res.status(404).json({ message: error.message });
            }
            else if (error.message === "El producto ya está asociado a esta empresa") {
                res.status(409).json({ message: error.message });
            }
            else {
                res.status(500).json({
                    message: "Error al añadir producto a la empresa",
                    error: error.message,
                });
            }
        }
    });
}
function getCompanyByName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchText = req.params.search;
            if (!searchText) {
                res.status(400).json({ message: "El texto de búsqueda es obligatorio" });
                return;
            }
            const companies = yield companyService.getCompanyByName(searchText);
            res.status(200).json(companies);
        }
        catch (error) {
            console.error("Error en getCompanySearch Controller:", error);
            res.status(500).json({ message: "Error al buscar compañías" });
        }
    });
}
function getCompaniesByProductName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const productName = req.params.name;
            if (!productName) {
                res.status(400).json({ message: "El nombre del producto es obligatorio" });
                return;
            }
            const companies = yield companyService.getCompaniesByProductName(productName);
            res.status(200).json(companies);
        }
        catch (error) {
            console.error("Error en getCompaniesByProductName Controller:", error);
            res.status(500).json({ message: "Error al buscar empresas por nombre de producto" });
        }
    });
}
function loginCompany(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: "Email y contraseña son obligatorios" });
                return;
            }
            const company = yield companyService.loginCompany(email, password);
            if (!company) {
                res.status(401).json({ message: "Email o contraseña incorrectos" });
                return;
            }
            res.status(200).json(company);
        }
        catch (error) {
            res.status(500).json({ message: "Error al iniciar sesión", error });
        }
    });
}
function updateCompanyAvatar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, avatar } = req.body;
            res.status(200).json({ message: "Avatar actualizado correctamente" });
            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error updating avatar", error });
            return;
        }
    });
}
function getPendingOrdersByCompanyId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            if (!id || id.length !== 24) {
                res.status(400).json({ message: "ID inválido" });
            }
            const orders = yield companyService.getPendingOrdersByCompanyId(id);
            if (!orders) {
                res.status(404).json({ message: "Pedidos no encontrados" });
                return;
            }
            console.log("Pedidos obtenidos:", orders);
            res.status(200).json(orders);
        }
        catch (error) {
            res.status(500).json({ message: "Error getting orders", error });
        }
    });
}
//# sourceMappingURL=company.controller.js.map
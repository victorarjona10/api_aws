"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    userRatingsTotal: { type: Number, required: false },
    description: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: {
            validator: function (value) {
                return value.includes('@');
            },
            message: 'Email must contain @'
        } },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    wallet: { type: Number, required: false, default: 0 },
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: false }],
    coordenates_lat: { type: Number, required: true },
    coordenates_lng: { type: Number, required: true },
    icon: { type: String, required: true },
    photos: [{ type: String, required: false }],
    followers: { type: Number, required: true, default: 0 },
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Review", required: false }],
    pendingOrders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: false }],
});
exports.CompanyModel = (0, mongoose_1.model)("Company", companySchema);
//# sourceMappingURL=company.js.map
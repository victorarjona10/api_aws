"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true, validate: {
            validator: function (value) {
                return value.includes('@');
            },
            message: 'Email must contain @'
        } },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    wallet: { type: Number, required: false, default: 0 },
    Flag: { type: Boolean, required: false, default: true },
    description: { type: String, required: false },
    avatar: { type: String, required: false },
    refreshToken: { type: String },
    refreshTokenExpiry: { type: Date, default: null },
    googleId: { type: String, required: false },
    company_Followed: [
        {
            company_id: {
                type: mongoose_2.default.Types.ObjectId,
                ref: 'Company',
                required: false
            },
        },
    ],
});
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.js.map
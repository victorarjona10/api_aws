"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true, validate: {
            validator: function (value) {
                return value.includes('@');
            },
            message: 'Email must contain @'
        } },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    password2: { type: String, required: true },
    Flag: { type: Boolean, required: false, default: true },
    refreshToken: { type: String },
    refreshTokenExpiry: { type: Date, default: null },
});
exports.AdminModel = (0, mongoose_1.model)("Admin", AdminSchema);
//# sourceMappingURL=admin.js.map
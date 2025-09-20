"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    company_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
exports.ReviewModel = (0, mongoose_1.model)('Review', reviewSchema);
//# sourceMappingURL=review.js.map
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
exports.startConnection = startConnection;
const mongoose_1 = require("mongoose");
const mongoURI = 'mongodb+srv://victorarjona:RkJ7CyZ46HzsvC3b@quickfindeaproject.mr2tj.mongodb.net/?retryWrites=true&w=majority&appName=QuickFindEAProject';
function startConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_1.connect)(mongoURI, {});
            console.log('Connected to MongoDB successfully!');
        }
        catch (err) {
            console.error('Unable to connect to MongoDB. Error:', err);
        }
    });
}
//# sourceMappingURL=database.js.map
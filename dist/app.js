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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const swagger_1 = require("./swagger");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const corsHandler_1 = require("./middleware/corsHandler");
const cors_1 = __importDefault(require("cors"));
const loggingHandler_1 = require("./middleware/loggingHandler");
const routeNotFound_1 = require("./middleware/routeNotFound");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const express_session_1 = __importDefault(require("express-session"));
const user_service_1 = require("./services/user.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const app = (0, express_1.default)();
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);
const PORT = process.env.PORT || 4000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";
app.use((0, express_session_1.default)({
    secret: "your_random_session_secret_here",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.disable('etag');
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_REDIRECT_URI,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userService = new user_service_1.UserService();
        const user = yield userService.findOrCreateUserFromGoogle(profile);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userService = new user_service_1.UserService();
        const user = yield userService.getUserById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
app.set("port", PORT);
app.use(corsHandler_1.corsHandler);
app.use(loggingHandler_1.loggingHandler);
app.use(express_1.default.json());
app.use(express_1.default.json());
(0, database_1.startConnection)();
(0, swagger_1.setupSwagger)(app);
app.use("/api/users", user_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/company", company_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/admins", admin_routes_1.default);
app.get("/api/auth/google/callback/test", (req, res) => {
    res.send("Google OAuth Succcess! 回调成功！请检查控制台日志。");
});
app.use((0, cors_1.default)({
    origin: ['http://react:4200', 'http://react:3000'],
    credentials: true
}));
app.use(routeNotFound_1.routeNotFound);
app.listen(PORT, () => {
    console.log(`Server running at  http://react:${PORT}`);
    console.log(`Swagger running at http://react:${PORT}/api-docs/`);
});
exports.default = app;
//# sourceMappingURL=app.js.map
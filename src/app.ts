import express, { RequestHandler, Request, Response } from "express";
import path from "path";
import { startConnection } from "./database";
import { setupSwagger } from "./swagger";
import userRoutes from "./routes/user.routes";
import productsRoutes from "./routes/product.routes";
import companyRoutes from "./routes/company.routes";
import pedidosRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";
import { corsHandler } from "./middleware/corsHandler";
import cors from "cors";
import { loggingHandler } from "./middleware/loggingHandler";
import { routeNotFound } from "./middleware/routeNotFound";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import { UserService } from "./services/user.service";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
// Removed duplicate import of express
const app = express();
app.use('/public', express.static(path.join(__dirname, '../public')));


console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);
// Removed duplicate import of axios
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 40000;
const HOST_IP = process.env.HOST_IP || "0.0.0.0";
const ANGULAR_PORT = process.env.ANGULAR_PORT || "4200";
const REACT_PORT = process.env.REACT_PORT || "3000";
const ANGULAR_DOMAIN = process.env.ANGULAR_DOMAIN || "react";
const REACT_DOMAIN = process.env.REACT_DOMAIN || "react";


// ================= Google OAuth 配置 =================
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";

// ================= Passport & Session 配置 =================
app.use(
  session({
    secret: "your_random_session_secret_here", // 可以随便写一个随机字符串
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.disable('etag');

// Google OAuth 策略
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URI,
      
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userService = new UserService();
        const user = await userService.findOrCreateUserFromGoogle(profile);
        
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

//comentario para hacer push
// comentario 
// 序列化用户（用于 session）//
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// 反序列化用户
passport.deserializeUser(async (id: string, done) => {
  try {
    const userService = new UserService();
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});



app.set("port", PORT);
app.use(corsHandler); //Middleware para gestionar las peticiones permitidas
app.use(loggingHandler); //Middleware para registrar las peticiones por consola
app.use(express.json());//Middleware para convertir JSON a objetos de JS a traves de req.body

app.use(express.json() as RequestHandler);

startConnection();

setupSwagger(app);

app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/orders", pedidosRoutes);
app.use("/api/admins", adminRoutes);

// ================= Google Test登录回调测试路由 =================
app.get("/api/auth/google/callback/test", (req: Request, res: Response) => {
  res.send("Google OAuth Succcess! 回调成功！请检查控制台日志。");
});

app.use(cors({
  origin: [`http://${ANGULAR_DOMAIN}:*`, `http://${REACT_DOMAIN}:*`, `http://147.83.7.208:80`, `http://ea6.upc.edu`, `http://react:*`, `http://172.31.36.54:*`], //quitar puertos y acerptar dominiso *
  credentials: true
}));

app.use(routeNotFound);//Middleware para informar de una ruta inexistente fuera de /users , /products ,etc.

app.listen(PORT,'0.0.0.0',() => {
  console.log(`Server running at new try  http://${HOST_IP}:${PORT}`);
  console.log(`Swagger running at http://${HOST_IP}:${PORT}/api-docs/`);
});

export default app;

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt from "jsonwebtoken";
import morgan from "morgan";

dotenv.config();
const PORT = process.env.PORT || 8000;
const SPRING_BOOT = process.env.SPRING_BOOT_URL || "http://localhost:8080";
const NEST = process.env.NEST_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// Middleware to verify JWT for protected routes
function verifyJWT(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth)
        return res
            .status(401)
            .json({ message: "Missing Authorization header" });
    const token = auth.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // attach user info to request so backends can read it if forwarded
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

// Proxy /auth/* → Spring Boot (no JWT required for login/register)
app.use(
    "/auth",
    createProxyMiddleware({
        target: SPRING_BOOT,
        changeOrigin: true,
        pathRewrite: { "^/auth": "/auth" },
        onProxyReq: (proxyReq, req, res) => {
            // optionally add headers to Spring Boot
            if (req.user)
                proxyReq.setHeader(
                    "x-forwarded-user",
                    JSON.stringify(req.user)
                );
        },
    })
);

// Proxy /transaction/* → NestJS (verify JWT first)
app.use(
    "/transaction",
    verifyJWT,
    createProxyMiddleware({
        target: NEST,
        changeOrigin: true,
        pathRewrite: { "^/transaction": "/transaction" },
        onProxyReq: (proxyReq, req, res) => {
            // forward user info to NestJS (optional)
            proxyReq.setHeader(
                "x-forwarded-user",
                JSON.stringify(req.user || {})
            );
            // forward original authorization header so Nest can also verify if desired
            if (req.headers.authorization)
                proxyReq.setHeader("authorization", req.headers.authorization);
        },
    })
);

app.listen(PORT, () =>
    console.log(`API Gateway listening on http://localhost:${PORT}`)
);

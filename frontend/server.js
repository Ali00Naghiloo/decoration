"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const url_1 = require("url");
// Determine if we are in development or production mode
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost"; // Standard for cPanel setups
// Get the port from the environment variable provided by cPanel/Phusion Passenger
// Fallback to 3000 for local development
const port = parseInt(process.env.PORT || "3105", 10);
// Create the Next.js app instance
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app
    .prepare()
    .then(() => {
    const server = (0, express_1.default)();
    // The custom server handles all requests and passes them to Next.js
    server.all("*", (req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        return handle(req, res, parsedUrl);
    });
    server.listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
    server.on("error", (err) => {
        console.error("Express server error:", err);
        process.exit(1);
    });
})
    .catch((err) => {
    console.error("Error starting Next.js server", err);
    process.exit(1);
});

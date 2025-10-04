// server.ts
import express, { Request, Response } from "express";
import next from "next";
import { parse } from "url";

// Determine if we are in development or production mode
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost"; // Standard for cPanel setups

// Get the port from the environment variable provided by cPanel/Phusion Passenger
// Fallback to 3000 for local development
const port = parseInt(process.env.PORT || "3105", 10);

// Create the Next.js app instance
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // The custom server handles all requests and passes them to Next.js
    server.all("*", (req: Request, res: Response) => {
      const parsedUrl = parse(req.url!, true);
      return handle(req, res, parsedUrl);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error starting Next.js server", err);
    process.exit(1);
  });

import express from "express";
import jsonServer from "json-server";
import auth from "json-server-auth";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const server = express();

server.use(
  cors({
    origin: ["http://localhost:3000", "https://bookworld-bw.netlify.app"],
    credentials: true,
  })
);

const middlewares = jsonServer.defaults();

// Apply default middlewares (logger, static, cors, no-cache)
server.use(middlewares);

// Enable CORS headers
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Load db.json
const router = jsonServer.router("./data/db.json");
server.db = router.db; // expose db for auth

// 🔑 Access rules for resources
const rules = auth.rewriter({
  products: 444, // only logged-in users can read/write
  featured_products: 444, // same as above
  orders: 660, // only owner can read/write
  users: 600, // only owner can write, read only self
});

// Apply auth and rules
server.use(rules);
server.use(auth);

// Mount API routes
server.use(router);

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`✅ JSON Server with Auth running at ${PORT}`);
});

// const express = require("express");
const { requireAuth } = require("./authMiddleware");

const path = require("path");
const authRoutes = require("./authRoutes");
const cookieParser = require("cookie-parser");

// const app = express();

// //global middleware
// app.use(express.static("public"));
// app.use(express.json());
// app.use(cookieParser());
// app.set("view engine", "ejs");

// // main route
// app.get("*", requireAuth);
// app.get("/", (req, res) => res.render("login"));

// app.use(authRoutes);

// app.listen(3000);

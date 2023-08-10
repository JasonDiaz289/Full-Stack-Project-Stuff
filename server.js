const express = require("express");

const path = require("path");
const authRoutes = require("./authRoutes");

const app = express();

//global middleware
app.use(express.static("public"));
app.use(express.json());

app.set("view engine", "ejs");
//app.use(express.static("public"));
// database connection

// routes
app.get("/", (req, res) => res.render("login"));

app.use(authRoutes);

app.listen(3000);

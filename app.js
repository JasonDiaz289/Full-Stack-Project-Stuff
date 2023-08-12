const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { requireAuth } = require("./authMiddleware");
const bcrypt = require("bcryptjs");
const authController = require("./authController");

const path = require("path");
const authRoutes = require("./authRoutes");
const cookieParser = require("cookie-parser");

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Full Stack Project Database",
  password: "",
  port: 5432,
});

app.use(express.static(__dirname + "/Profile_Page"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.get("/", requireAuth, (req, res) => {
  console.log("redirect bro");
  res.redirect("/profile");
});

app.use(express.static("public"));

app.use(cookieParser());

app.get("/signup", authController.signup_get);
app.post("/signup", authController.signup_post);

app.get("/login", authController.login_get);
app.post("/login", authController.login_post);
app.get("/logout", authController.logout_get);

app.use(authRoutes);

app.get("/profile/edit", (req, res) => {
  res.render("profile_edit");
});

app.get("/profile/feed", (req, res) => {
  pool.query("SELECT * FROM pet_profiles_4 WHERE id = 4", (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      return res.status(500).send("Error fetching data from database");
    }
    const data = result.rows;
    res.render("feed", { data });
  });
});

app.get("/profile/:userID", (req, res) => {
  const userID = req.params.userID;
  pool.query(
    `SELECT * FROM pet_profiles_4 WHERE id = ${userID}`,
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Error fetching data from the database");
      }

      const data = result.rows[0];
      data.hasImage = data.image_data ? true : false;

      res.render("profile", { data });
    }
  );
});

app.post("/profile/edit", (req, res) => {
  const { id, name, breed, age, weight, relationship_status, image_data } =
    req.body;
  console.log(req.body);
  if (
    !id ||
    !name ||
    !breed ||
    !age ||
    !weight ||
    !relationship_status ||
    !image_data
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }
  pool.query(
    "UPDATE pet_profiles_4 SET name = $1, breed = $2, age = $3, weight = $4, relationship_status = $5, image_data = $6 WHERE id = $7",
    [name, breed, age, weight, relationship_status, image_data, id],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        return res
          .status(500)
          .json({ error: "Error inserting data into the database." });
      }

      res
        .status(201)
        .json({ message: "Data successfully inserted into the database." });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Full Stack Project Database",
  password: "",
  port: 5432,
});


app.use(express.static(__dirname +'/Profile_Page'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("welcome");
});

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
    res.render("feed", { data } );
  });
});


app.get("/profile", (req, res) => {
  pool.query("SELECT * FROM pet_profiles_4 WHERE id = 4", (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      return res.status(500).send("Error fetching data from the database");
    }

    const data = result.rows;

    res.render("profile", { data });
  });
});

app.put("/edit", (req, res) => {
  console.log("if you like pina coladas");
  const { name, breed, age, weight, relationship_status } = req.body;
  if (!name || !breed || !age || !weight || !relationship_status) {
    return res.status(400).json({ error: "All fields are required." });
  }
 
  pool.query(
    "UPDATE pet_profiles_4 SET (name, breed, age, weight, relationship_status) = ($1, $2, $3, $4, $5) WHERE id = 1",
    [name, breed, age, weight, relationship_status],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
        return res
          .status(500)
          .json({ error: "Error updating data into the database." });
      }

      res
        .status(201)
        .json({ message: "Data successfully updated into the database." });
    }
  );
});

app.post("/", (req, res) => {
  const { name, breed, age, weight, relationship_status, image_data } = req.body;
  console.log(req.body);
  if (!name || !breed || !age || !weight || !relationship_status || !image_data) {
    return res.status(400).json({ error: "All fields are required." });
  }
  pool.query(
    "INSERT INTO pet_profiles_4 (name, breed, age, weight, relationship_status, image_data) values ($1, $2, $3, $4, $5, $6)",
    [name, breed, age, weight, relationship_status, image_data],
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

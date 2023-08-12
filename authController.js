const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const { secret } = require("./config");
const { Client } = require("pg");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "email not found";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60; //!!!change the id
const createToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "Full Stack Project Database",
    password: "",
    port: 5432,
  });

  try {
    await client.connect();
    // add validation and check if user exsists

    const hashPassword = bcrypt.hashSync(password, 7);
    const results = await client.query(
      "INSERT INTO authuser(email, password) VALUES($1, $2)",
      [email, hashPassword]
    );

    const user = await client.query(
      "INSERT INTO pet_profiles_4(name, breed, age, weight, relationship_status, image_data, fk_column_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      ["Your Name", "Your Breed", 100, 20, "Out and About", null, email]
    );

    const userID = user.rows[0].id;

    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ userID });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  } finally {
    await client.end();
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  console.log("email, password", email, password);
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "Full Stack Project Database",
    password: "",
    port: 5432,
  });
  try {
    await client.connect();
    const result = await client.query(
      "SELECT p.id, password FROM authuser a JOIN pet_profiles_4 p ON p.fk_column_name = a.email WHERE a.email = $1",
      [email]
    );
    // console.log(result);
    if (result.rows.length != 0) {
      const auth = bcrypt.compareSync(password, result.rows[0].password);
      //  console.log("auth " + auth);
      if (!auth) throw Error("incorrect password");
    } else throw Error("incorrect email");
    await client.end();

    const token = createToken(email);
    console.log("token", token);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    const userID = result.rows[0].id;
    res.status(200).json({ userID });
  } catch (err) {
    const errors = handleErrors(err);
    console.log("here be errors", err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

const jwt = require("jsonwebtoken");
const { secret } = require("./config");

const requireAuth = (req, res, next) => {
  console.log("dis the req", req.cookies);
  const { jwt: token = "" } = req.cookies || {};
  console.log("here here", token);

  // check json web token exists & is verified
  if (token) {
    console.log("we have token");
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log("decodeToken", decodedToken);
        console.log("wtf is next", next())
        next();
      }
    });
  } else {
    console.log("we redirecting bruh weeee");
    res.redirect("/login");
  }
};

module.exports = { requireAuth };

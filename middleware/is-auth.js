const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "thisisatokenid");
  } catch (err) {
    //this is for techniqual faliure
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    //token is not matched
    const error = new Error("Not authenticated");
    error.statusCode = 400;
    throw error;
  }

  req.user_id = decodedToken.user_id; //transfer token's saved id for request ,can access by next middleware in the router
  next();
};

const express = require("express");
let router = express.Router();

module.exports = passport => {

  //github routes
  router.get("/github", passport.authenticate("github"));

  router.get(
    "/github/callback",
    passport.authenticate("github", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  return router;
}

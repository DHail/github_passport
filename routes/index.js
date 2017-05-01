const express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
  if (req.user) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

module.exports = router;

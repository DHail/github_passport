const app = require("express")();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");
require("dotenv").config();
// const request = require("request");

app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(
  expressSession({
    secret: process.env.secret || "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

// User and Mongoose code
const User = require("./models/User");
const mongoose = require("mongoose");

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    mongoose.connect("mongodb://localhost/passport-assignment").then(() => {
      // cleanDb().then(() => {
      next();
      // })
    });
  }
});

// require Passport
const passport = require("passport");
const GitHubStrategy = require("passport-github2");
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        {githubId: profile.id, displayName: profile.displayName},
        function(err, user) {
          user.token = accessToken;
          return done(err, user);
        }
      );
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//github routes
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

//routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// Set up express-handlebars
const exphbs = require("express-handlebars");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "application",
    partialsDir: "./views/partials"
  })
);

app.set("view engine", "handlebars");

const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
app.listen(port, hostname);

var express = require("express");
var mongoose = require("mongoose");
require("dotenv").config();
var passport = require("passport");
var cors = require("cors");

var routes = require("./routes");
var app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(passport.initialize());

// MongoDB
mongoose.connect(
  `mongodb+srv://posist:n7Uakwdgs8fAB0qb@cluster0.m27zehu.mongodb.net/posist_app?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// initialise routes
routes(app);

// Server
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Server running on PORT: ${PORT}`);
});

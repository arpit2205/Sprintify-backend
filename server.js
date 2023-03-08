var express = require("express");
var mongoose = require("mongoose");
require("dotenv").config();
var passport = require("passport");
var cors = require("cors");

var app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// MongoDB
mongoose.connect(
  `mongodb+srv://posist:n7Uakwdgs8fAB0qb@cluster0.m27zehu.mongodb.net/posist_app?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

/* 
Routes
*/

// Public routes
app.use("/api/auth", require("./routes/auth/login"));

// Super admin routes
app.use("/api/super-admin/auth", require("./routes/superAdmin/auth"));
app.use("/api/super-admin", require("./routes/superAdmin/manageAdmins"));

// Brand admin routes
app.use("/api/brand-admin/auth", require("./routes/brandAdmin/auth"));
app.use("/api/brand-admin", require("./routes/brandAdmin/manageUsers"));

// Brand user routes
app.use(
  "/api/brand-user/projects",
  require("./routes/brandUser/public/project")
);
app.use(
  "/api/brand-user/projects",
  require("./routes/brandUser/manager/project")
);
app.use("/api/brand-user/users", require("./routes/brandUser/public/users"));
app.use("/api/brand-user/tasks", require("./routes/brandUser/public/tasks"));

// Server
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Server running on PORT: ${PORT}`);
});

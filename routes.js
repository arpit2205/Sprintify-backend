module.exports = function (app) {
  // Public routes
  app.use("/api/auth", require("./api/auth/login"));

  // Super admin routes
  app.use("/api/super-admin/auth", require("./api/superAdmin/auth"));
  app.use("/api/super-admin", require("./api/superAdmin/manageAdmins"));
  app.use("/api/super-admin/stats", require("./api/superAdmin/stats"));

  // Brand admin routes
  app.use("/api/brand-admin/auth", require("./api/brandAdmin/auth"));
  app.use("/api/brand-admin", require("./api/brandAdmin/manageUsers"));
  app.use("/api/brand-admin/stats", require("./api/brandAdmin/stats"));

  // Brand user routes
  app.use(
    "/api/brand-user/projects",
    require("./api/brandUser/public/project")
  );
  app.use(
    "/api/brand-user/projects",
    require("./api/brandUser/manager/project")
  );
  app.use("/api/brand-user/users", require("./api/brandUser/public/users"));
  app.use("/api/brand-user/tasks", require("./api/brandUser/public/tasks"));
  app.use("/api/brand-user/tasks", require("./api/brandUser/manager/tasks"));
  app.use("/api/brand-user/sprints", require("./api/brandUser/manager/sprint"));
  app.use("/api/brand-user/sprints", require("./api/brandUser/public/sprint"));
  app.use(
    "/api/brand-user/tasks/comments",
    require("./api/brandUser/public/comment")
  );
};

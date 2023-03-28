var express = require("express");
var router = express.Router();

var Task = require("../../../models/task");
var TaskLog = require("../../../models/taskLog");

// middlewares
var verifyBrandUser = require("../../../middleware/verifyBrandUser");
var passport = require("passport");
require("../../../middleware/passportJwt")(passport);
var taskLogger = require("../../../middleware/taskLogger");

// file upload
var s3Client = require("../../../config/aws");
var multer = require("multer");
var multerS3 = require("multer-s3");

var {
  numberOfCreatedTasksWeekly,
  numberOfCompletedTasksWeekly,
  numberOfTotalAndCompletedTasks,
  percentOfTasksByStatus,
  fiveMostActiveUsers,
  numberOfUnassignedTasks,
} = require("../../../aggregations/task");

// Multer s3 config
var upload = multer({
  storage: multerS3({
    s3: s3Client,
    ACL: "public-read",
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

// create task
router.post(
  "/create-task",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var taskId = req.body.taskId;
    var title = req.body.title;
    var description = req.body.description;

    var owner = {
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      roles: req.user.roles,
    };

    var assignedTo = req.body.assignedTo;
    var project = req.body.project;
    var sprint = req.body.sprint;
    var status = req.body.status;
    var type = req.body.type;
    var priority = req.body.priority;

    Task.create({
      taskId: taskId,
      title: title,
      description: description,
      owner: owner,
      assignedTo: assignedTo,
      project: project,
      sprint: sprint,
      status: status,
      type: type,
      priority: priority,
    })
      .then(function (data) {
        res.status(201).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// fetch all tasks of a project
router.get(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var projectId = req.params.id;

    var page = req.query.page;
    var limit = req.query.limit;
    var text = req.query.text;
    var status = req.query.status;
    var type = req.query.type;
    var priority = req.query.priority;
    var sprint = req.query.sprint;

    var queries = {};

    queries["project.projectId"] = projectId;
    queries.isDeleted = false;
    if (text !== "undefined" && text !== "")
      queries.title = { $regex: text, $options: "i" };
    if (status !== "undefined" && status !== "") queries.status = status;
    if (type !== "undefined" && type !== "") queries.type = type;
    if (priority !== "undefined" && priority !== "")
      queries.priority = priority;
    if (sprint !== "undefined" && sprint !== "" && sprint !== "null")
      queries["sprint.name"] = sprint;

    Task.count(queries)
      .then(function (data) {
        var count = data;

        Task.find(queries)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(10)
          .then(function (data) {
            res
              .status(200)
              .json({ status: "success", data: data, totalDocuments: count });
          });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// fetch details of a single task
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var taskId = req.params.id;

    Task.findById(taskId)
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// update a task
router.patch(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res, next) {
    var taskId = req.params.id;

    var type = req.body.type;
    var priority = req.body.priority;
    var status = req.body.status;
    var assignedTo = req.body.assignedTo;
    var description = req.body.description;

    var toBeEdited = {};

    if (type) {
      toBeEdited.type = type;
    }

    if (priority) {
      toBeEdited.priority = priority;
    }

    if (status) {
      toBeEdited.status = status;
    }

    if (assignedTo) {
      if (assignedTo === "unassign") toBeEdited.assignedTo = null;
      else toBeEdited.assignedTo = assignedTo;
    }

    if (description) {
      toBeEdited.description = description;
    }

    Task.findByIdAndUpdate(taskId, toBeEdited, { new: true })
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
        req.taskLogActionType = "task-edit";
        req.fieldsEdited = toBeEdited;
        if (assignedTo === "unassign") {
          req.fieldsEdited.assignedTo = "unassign";
        }
        req.data = data;
        next();
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  },
  taskLogger
);

// assign task to myself
router.patch(
  "/pick-task/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res, next) {
    Task.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: {
          userId: req.user._id,
          name: req.user.name,
          email: req.user.email,
          roles: req.user.roles,
        },
      },
      { new: true }
    )
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
        req.taskLogActionType = "task-pick";
        req.data = data;
        next();
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  },
  taskLogger
);

// file upload
router.post(
  "/upload-attachment/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  upload.single("image"),
  function (req, res, next) {
    // Multer s3 upload
    var uploadedImage = {
      key: req.file.key,
      location: req.file.location,
    };

    var taskId = req.params.id;

    // Set url to mongodb
    Task.findOneAndUpdate(
      { _id: taskId },
      { $push: { attachments: uploadedImage } },
      { new: true }
    )
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
        req.taskLogActionType = "task-upload-attachment";
        req.data = data;
        next();
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  },
  taskLogger
);

router.patch(
  "/delete-attachment",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res, next) {
    var taskId = req.body.taskId;
    var imageKey = req.body.imageKey;

    Task.findOneAndUpdate(
      { _id: taskId },
      { $pull: { attachments: { key: imageKey } } },
      { safe: true, multi: false, new: true }
    )
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
        req.taskLogActionType = "task-delete-attachment";
        req.data = data;
        next();
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  },
  taskLogger
);

// fetch tasklogs of a task
router.get(
  "/logs/:id",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var taskId = req.params.id;

    TaskLog.find({ "task.taskId": taskId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .then(function (data) {
        res.status(200).json({ status: "success", data: data });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });
  }
);

// fetch weekly task digest chart
router.get(
  "/weekly-chart/:projectId",
  passport.authenticate("jwt", { session: false }),
  verifyBrandUser,
  function (req, res) {
    var projectId = req.params.projectId;

    Promise.all([
      Task.aggregate(numberOfCreatedTasksWeekly(projectId)),
      TaskLog.aggregate(numberOfCompletedTasksWeekly(projectId)),
      Task.aggregate(numberOfTotalAndCompletedTasks(projectId)),
      Task.aggregate(percentOfTasksByStatus(projectId)),
      TaskLog.aggregate(fiveMostActiveUsers(projectId)),
      Task.aggregate(numberOfUnassignedTasks(projectId)),
    ])
      .then(function (data) {
        res.status(200).json({
          status: "success",
          data: {
            weeklyCreatedTasks: data[0],
            weeklyCompletedTasks: data[1],
            percentCompletedTasks: data[2],
            percentTasksByStatus: data[3],
            fiveMostActiveUsers: data[4],
            unassignedTasksCount: data[5],
          },
        });
      })
      .catch(function (error) {
        res.status(500).json({ status: "error", data: error });
      });

    // Task.aggregate(numberOfCreatedTasksWeekly(projectId))
    //   .then(function (data) {
    //     var createdData = data;

    //     TaskLog.aggregate(numberOfCompletedTasksWeekly(projectId)).then(
    //       function (data) {
    //         var completedData = data;

    //         Task.aggregate(numberOfTotalAndCompletedTasks(projectId)).then(
    //           function (data) {
    //             var result = {
    //               createdData: createdData,
    //               completedData: completedData,
    //               overallData: data,
    //             };
    //             res.status(200).json({ status: "success", data: result });
    //           }
    //         );
    //       }
    //     );
    //   })
    //   .catch(function (error) {
    //     res.status(500).json({ status: "error", data: error });
    //   });
  }
);

module.exports = router;

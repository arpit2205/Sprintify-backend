var TaskLog = require("../models/taskLog");

function taskLogger(req, res, next) {
  var user = req.user;
  var data = req.data;

  if (req.taskLogActionType === "task-pick") {
    TaskLog.create({
      logString: `${req.user.name} picked this task`,
      project: data.project,
      task: {
        taskId: data._id.toString(),
        title: data.title,
      },
      actionType: "task-pick",
      user: {
        userID: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roles: req.user.roles,
      },
    })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (req.taskLogActionType === "task-edit") {
    console.log(req.fieldsEdited);

    if (Object.keys(req.fieldsEdited).length === 0) {
      return;
    }

    var logString = `${user.name}`;

    if (req.fieldsEdited.type) {
      logString += ` changed type to ${req.fieldsEdited.type}`;
    }

    if (req.fieldsEdited.priority) {
      logString += ` changed priority to ${req.fieldsEdited.priority}`;
    }

    if (req.fieldsEdited.status) {
      logString += ` changed status to ${req.fieldsEdited.status}`;
    }

    if (req.fieldsEdited.assignedTo) {
      if (req.fieldsEdited.assignedTo === "unassign") {
        logString += ` unassigned this task`;
      } else
        logString += ` assigned this task to ${req.fieldsEdited.assignedTo.name} (${req.fieldsEdited.assignedTo.email})`;
    }

    if (req.fieldsEdited.description) {
      logString += ` changed task description`;
    }

    TaskLog.create({
      logString: logString,
      project: data.project,
      task: {
        taskId: data._id.toString(),
        title: data.title,
      },
      actionType: "task-edit",
      user: {
        userID: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roles: req.user.roles,
      },
      status: req.fieldsEdited.status ? req.fieldsEdited.status : null,
    })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (req.taskLogActionType === "task-upload-attachment") {
    TaskLog.create({
      logString: `${req.user.name} uploaded an attachment`,
      project: data.project,
      task: {
        taskId: data._id.toString(),
        title: data.title,
      },
      actionType: "task-pick",
      user: {
        userID: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roles: req.user.roles,
      },
    })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (req.taskLogActionType === "task-delete-attachment") {
    TaskLog.create({
      logString: `${req.user.name} deleted an attachment`,
      project: data.project,
      task: {
        taskId: data._id.toString(),
        title: data.title,
      },
      actionType: "task-pick",
      user: {
        userID: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roles: req.user.roles,
      },
    })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  next();
}

module.exports = taskLogger;

// weekly created/completed tasks
var numberOfCreatedTasksWeekly = function (projectId) {
  return [
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          $lte: new Date(),
        },
        isDeleted: false,
        "project.projectId": projectId,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$createdAt",
          },
        },
        created_count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];
};

var numberOfCompletedTasksWeekly = function (projectId) {
  return [
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          $lte: new Date(),
        },
        isDeleted: false,
        "project.projectId": projectId,
        status: "completed",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$createdAt",
          },
        },
        completed_count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];
};

var numberOfTotalAndCompletedTasks = function (projectId) {
  return [
    {
      $match: {
        isDeleted: false,
        "project.projectId": projectId,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: 1,
        },
        completed: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$status", "completed"],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
  ];
};

var percentOfTasksByStatus = function (projectId) {
  return [
    {
      $match: {
        isDeleted: false,
        "project.projectId": projectId,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: 1,
        },
        todo: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "todo"],
              },
              1,
              0,
            ],
          },
        },
        inProgress: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "in-progress"],
              },
              1,
              0,
            ],
          },
        },
        testing: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "testing"],
              },
              1,
              0,
            ],
          },
        },
        completed: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "completed"],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        todo: {
          $multiply: [
            {
              $divide: ["$todo", "$total"],
            },
            100,
          ],
        },
        inProgress: {
          $multiply: [
            {
              $divide: ["$inProgress", "$total"],
            },
            100,
          ],
        },
        testing: {
          $multiply: [
            {
              $divide: ["$testing", "$total"],
            },
            100,
          ],
        },
        completed: {
          $multiply: [
            {
              $divide: ["$completed", "$total"],
            },
            100,
          ],
        },
      },
    },
  ];
};

var fiveMostActiveUsers = function (projectId) {
  return [
    {
      $match: {
        isDeleted: false,
        "project.projectId": projectId,
      },
    },
    {
      $group: {
        _id: "$user.email",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ];
};

var numberOfUnassignedTasks = function (projectId) {
  return [
    {
      $match: {
        assignedTo: null,
        isDeleted: false,
        "project.projectId": projectId,
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ];
};

module.exports = {
  numberOfCreatedTasksWeekly: numberOfCreatedTasksWeekly,
  numberOfCompletedTasksWeekly: numberOfCompletedTasksWeekly,
  numberOfTotalAndCompletedTasks: numberOfTotalAndCompletedTasks,
  percentOfTasksByStatus: percentOfTasksByStatus,
  fiveMostActiveUsers: fiveMostActiveUsers,
  numberOfUnassignedTasks: numberOfUnassignedTasks,
};

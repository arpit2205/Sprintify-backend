var percentageOfTasksCompletedForAllSprints = function (projectId) {
  return [
    {
      $match: {
        "project.projectId": projectId,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$sprint.sprintId",
        totalTasks: {
          $sum: 1,
        },
        completedTasks: {
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
    {
      $addFields: {
        percentCompleted: {
          $multiply: [
            {
              $divide: ["$completedTasks", "$totalTasks"],
            },
            100,
          ],
        },
      },
    },
  ];
};

var sprintTypeCounts = function (projectId) {
  return [
    {
      $match: {
        "project.projectId": projectId,
        isDeleted: false,
      },
    },
    {
      $facet: {
        activeSprints: [
          { $match: { isStarted: true, isCompleted: false } },
          { $count: "count" },
        ],
        upcomingSprints: [
          { $match: { isStarted: false } },
          { $count: "count" },
        ],
        completedSprints: [
          { $match: { isCompleted: true } },
          { $count: "count" },
        ],
        activeOverdueSprints: [
          {
            $match: {
              isStarted: true,
              isCompleted: false,
              $expr: {
                $gt: [
                  { $subtract: [new Date(), { $toDate: "$startedAt" }] },
                  { $multiply: ["$duration", 86400000] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        completedOverdueSprints: [
          {
            $match: {
              isStarted: true,
              isCompleted: true,
              $expr: {
                $gt: [
                  {
                    $subtract: [
                      { $toDate: "$completedAt" },
                      { $toDate: "$startedAt" },
                    ],
                  },
                  { $multiply: ["$duration", 86400000] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        onTimeCompleted: [
          {
            $match: {
              isCompleted: true,
              $expr: {
                $lte: [
                  {
                    $subtract: [
                      { $toDate: "$completedAt" },
                      { $toDate: "$startedAt" },
                    ],
                  },
                  { $multiply: ["$duration", 86400000] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ];
};

module.exports = {
  percentageOfTasksCompletedForAllSprints:
    percentageOfTasksCompletedForAllSprints,
  sprintTypeCounts: sprintTypeCounts,
};

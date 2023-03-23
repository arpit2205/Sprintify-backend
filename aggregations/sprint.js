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

module.exports = {
  percentageOfTasksCompletedForAllSprints:
    percentageOfTasksCompletedForAllSprints,
};

var projectCounts = function (brandId) {
  return [
    {
      $match: { "brand.brandId": brandId, isDeleted: false },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
        not_completed: {
          $sum: {
            $cond: [{ $ne: ["$status", "completed"] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];
};

var projectList = function (brandId) {
  return [
    {
      $match: { "brand.brandId": brandId, isDeleted: false },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        status: 1,
        owner: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: 1 },
    },
  ];
};

var taskCountInProjects = function (brandId) {
  return [
    {
      $match: { "brand.brandId": brandId, isDeleted: false },
    },
    {
      $group: {
        _id: "$project.title",
        totalTasks: { $sum: 1 },
      },
    },
  ];
};

module.exports = {
  projectCounts: projectCounts,
  projectList: projectList,
  taskCountInProjects: taskCountInProjects,
};

var totalTasks = function () {
  return [
    {
      $match: { isDeleted: false },
    },
    {
      $count: "total_tasks",
    },
  ];
};

module.exports = {
  totalTasks: totalTasks,
};

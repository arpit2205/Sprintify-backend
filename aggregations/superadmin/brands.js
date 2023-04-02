var totalBrands = function () {
  return [
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        documents: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        documents: 1,
      },
    },
  ];
};

module.exports = {
  totalBrands: totalBrands,
};

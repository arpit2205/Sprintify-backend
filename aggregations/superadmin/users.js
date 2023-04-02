var totalUsers = function () {
  return [
    {
      $match: { isDeleted: false },
    },
    {
      $count: "total_users",
    },
  ];
};

var totalUsersOfABrand = function (brandId) {
  return [
    {
      $match: { "brand.brandId": brandId, isDeleted: false },
    },
    {
      $count: "total_users",
    },
  ];
};

module.exports = {
  totalUsers: totalUsers,
  totalUsersOfABrand: totalUsersOfABrand,
};

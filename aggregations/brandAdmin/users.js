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
  totalUsersOfABrand: totalUsersOfABrand,
};

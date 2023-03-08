const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "brands",
    timestamps: true,
  }
);

const Brand = mongoose.model("brands", brandSchema);
module.exports = Brand;

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
      default: [],
    },
    permissions: {
      type: Array,
      required: true,
      default: [],
    },
    isSuperAdmin: {
      type: Boolean,
      required: true,
    },
    isBrandAdmin: {
      type: Boolean,
      required: true,
    },
    isBrandUser: {
      type: Boolean,
      required: true,
    },
    brand: {
      type: Object,
      required: true,
      brandId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      logoUrl: {
        type: String,
        required: true,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    didPasswordReset: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;

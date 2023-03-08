const mongoose = require("mongoose");

const permissionSchema = mongoose.Schema(
  {
    role: {
      type: String,
      unique: true,
      required: true,
    },
    permissions: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    collection: "permissions",
  }
);

const Permissions = mongoose.model("permissions", permissionSchema);
module.exports = Permissions;

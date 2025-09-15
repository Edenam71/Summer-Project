const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const houseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 5000,
    },
    gender: {
      type: String,
      enum: ["female", "male", "non-binary", "any"],
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },

    images: {
      type: [String],
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("House", houseSchema);

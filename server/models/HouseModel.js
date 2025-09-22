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

    starting_date: {
      type: Date,
      required: true,
    },
    ending_date: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return !this.starting_date || value >= this.starting_date;
        },
        message: "ending date must be on or after starting date",
      },
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

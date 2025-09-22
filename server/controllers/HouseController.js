/*
//const { createElement } = require("react");
const House = require("../models/HouseModel");
const mongoose = require("mongoose");

//get a single house

const getHouse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such house" });
  }

  const house = await House.findById(id);
  if (!house) {
    return res.status(404).json({ error: "No such House" });
  }

  res.status(200).json(house);
};

//get all houses

const getAllHouses = async (req, res) => {
  const houses = await House.find({}).sort({ createdAt: -1 });
  res.status(200).json(houses);
};

//create a new house
const createHouse = async (req, res) => {
  const {
    title,
    description,
    gender,
    age,
    starting_date,
    ending_date,
    images,
  } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!description) {
    emptyFields.push("description");
  }

  if (!gender) {
    emptyFields.push("gender");
  }
  if (!age) {
    emptyFields.push("age");
  }
  if (!starting_date) {
    emptyFields.push("starting_date");
  }
  if (!ending_date) {
    emptyFields.push("ending_date");
  }
  if (!images) {
    emptyFields.push("images");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  //add house to db
  try {
    const house = await House.create({
      title,
      description,
      gender,
      age,
      starting_date,
      ending_date,
      images,
    });
    res.status(200).json(house);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a house

const deleteHouse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such house" });
  }
  const house = await House.findOneAndDelete({ _id: id });

  if (!house) {
    return res.status(404).json({ error: "Error deleting house" });
  }
  res.status(200).json(house);
};

//update a house

const updateHouse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such house" });
  }
  const house = await House.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!house) {
    return res.status(404).json({ error: "Error deleting house" });
  }
  res.status(200).json(house);
};

module.exports = {
  createHouse,
  getAllHouses,
  getHouse,
  deleteHouse,
  updateHouse,
};

*/
// controllers/HouseController.js
// controllers/HouseController.js

const mongoose = require("mongoose");
// Adjust the path if your model file is named differently
const House = require("../models/HouseModel");

/* ----------------------------- Helpers ----------------------------- */
function sendValidationError(res, err) {
  // Map mongoose ValidationError -> { error, emptyFields }
  const emptyFields = Object.keys(err.errors); // e.g. ["description","gender","starting_date","ending_date"]

  // If they are all "required", show the friendly generic message
  const onlyRequired = Object.values(err.errors).every(
    (e) => e.kind === "required"
  );

  const message = onlyRequired
    ? "Please fill in all the fields"
    : Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");

  return res.status(400).json({ error: message, emptyFields });
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* --------------------------- Controllers --------------------------- */

// GET /api/houses – list all
const getAllHouses = async (_req, res) => {
  try {
    const houses = await House.find({}).sort({ createdAt: -1 });
    return res.status(200).json(houses);
  } catch (err) {
    console.error("getAllHouses error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET /api/houses/:id – single
const getHouse = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(404).json({ error: "No such house" });

  try {
    const house = await House.findById(id);
    if (!house) return res.status(404).json({ error: "No such house" });
    return res.status(200).json(house);
  } catch (err) {
    console.error("getHouse error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// POST /api/houses – create
const createHouse = async (req, res) => {
  try {
    const house = await House.create(req.body); // runs schema validators
    return res.status(201).json(house);
  } catch (err) {
    if (err.name === "ValidationError") return sendValidationError(res, err);
    console.error("createHouse error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/houses/:id – delete
const deleteHouse = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(404).json({ error: "No such house" });

  try {
    const house = await House.findOneAndDelete({ _id: id });
    if (!house) return res.status(404).json({ error: "No such house" });
    return res.status(200).json(house);
  } catch (err) {
    console.error("deleteHouse error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/houses/:id – update
const updateHouse = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(404).json({ error: "No such house" });

  try {
    const updated = await House.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      {
        new: true, // return the updated doc
        runValidators: true, // enforce schema validators on update
        context: "query", // needed for some validators (e.g., those using 'this')
      }
    );
    if (!updated) return res.status(404).json({ error: "No such house" });
    return res.status(200).json(updated);
  } catch (err) {
    if (err.name === "ValidationError") return sendValidationError(res, err);
    console.error("updateHouse error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* ---------------------------- Exports ----------------------------- */
module.exports = {
  createHouse,
  getAllHouses,
  getHouse,
  deleteHouse,
  updateHouse,
};

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
  const { title, description, gender, age, images } = req.body;

  //add house to db
  try {
    const house = await House.create({
      title,
      description,
      gender,
      age,
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

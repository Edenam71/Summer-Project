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

const getMyHouse = async (req, res) => {
  try {
    const user_id = req.user?._id;
    if (!user_id)
      return res.status(401).json({ error: "Authorization required" });

    const houses = await House.find({ user_id }).sort({ createdAt: -1 });
    return res.status(200).json(houses);
  } catch (err) {
    console.error("getMyHouse error:", err);
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
    if (!req.user?._id) {
      return res.status(401).json({ error: "Authorization required" });
    }
    const house = await House.create({
      ...req.body, // title, description, gender, age, dates, images, etc.
      user_id: req.user._id,
    });

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

    const ownerId = house.user_id?.toString?.() ?? String(house.user_id);
    if (ownerId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }
    await house.deleteOne();

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
  getMyHouse,
  getHouse,
  deleteHouse,
  updateHouse,
};

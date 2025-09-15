const express = require("express");
const router = express.Router();
const {
  createHouse,
  getAllHouses,
  getHouse,
  deleteHouse,
  updateHouse,
} = require("../controllers/HouseController");

//get a house request
router.get("/:id", getHouse);

//get all houses
router.get("/", getAllHouses);

//post a house request
router.post("/", createHouse);

//delete a house request
router.delete("/:id", deleteHouse);

//update a house
router.patch("/:id", updateHouse);

module.exports = router;

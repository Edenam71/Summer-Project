const express = require("express");
const {
  createHouse,
  getAllHouses,
  getMyHouse,
  getHouse,
  deleteHouse,
  updateHouse,
} = require("../controllers/HouseController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//public

//get user's houses

router.get("/mine", requireAuth, getMyHouse);

//get all houses

router.get("/", getAllHouses);

//get a house request

router.get("/:id", getHouse);

router.use(requireAuth);
//Everything below this requires authorization

//post a house request
router.post("/", createHouse);

//delete a house request
router.delete("/:id", deleteHouse);

//update a house
router.patch("/:id", updateHouse);

module.exports = router;

const express = require("express")
const router = express.Router()
// Import the user authentication function from Auth
const { userAuth } = require("../middleware/auth")

const { getClothes } = require("./ClothingFunctions")

// The route and the method and function that are used in it
router.route("/getClothes").get(userAuth, getClothes)

module.exports = router
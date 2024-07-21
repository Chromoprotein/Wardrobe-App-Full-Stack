const express = require("express")
const router = express.Router()
// Import the user authentication function from Auth
const { userAuth } = require("../middleware/auth")
const multer = require('multer');

const { getClothes, getItemById, addItem, deleteItem, updateItem, uploadImage, fetchImageById } = require("./ClothingFunctions")

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// The route and the method and function that are used in it
router.route("/getClothes").get(userAuth, getClothes)
router.route("/getItemById/:id").get(userAuth, getItemById)
router.route("/addItem").post(userAuth, upload.none(), addItem)
router.route("/updateItem/:id").put(userAuth, upload.none(), updateItem)
router.route("/deleteItem/:id").delete(userAuth, deleteItem)

router.route("/uploadImage/:id").post(userAuth, upload.single('file'), uploadImage)
router.route("/fetchImageById/:id").get(userAuth, fetchImageById)

module.exports = router 
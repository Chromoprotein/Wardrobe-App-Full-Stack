const express = require("express")
const router = express.Router()
// Import the user authentication function from Auth
const { userAuth } = require("../middleware/auth")
const multer = require('multer');

const { getClothes, getItemById, addItem, deleteItem, updateItem, uploadImage, addOutfit, fetchOutfits, deleteOutfit, updateWearCount } = require("./ClothingFunctions")

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB in bytes
  fileFilter: (req, file, cb) => {
    // Check the file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed!'), false);
    }
    cb(null, true);
  }
});

// Middleware to handle Multer errors
const uploadHandler = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          message: 'File size exceeds the limit!',
        });
      }
    } else if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    next(); // Continue to main logic if no error
  });
};

// The route and the method and function that are used in it
router.route("/getClothes").get(userAuth, getClothes)
router.route("/fetchOutfits").get(userAuth, fetchOutfits)
router.route("/getItemById/:id").get(userAuth, getItemById)
router.route("/addItem").post(userAuth, upload.none(), addItem)
router.route("/addOutfit").post(userAuth, upload.none(), addOutfit)
router.route("/updateItem/:id").put(userAuth, upload.none(), updateItem)
router.route("/updateWearCount").put(userAuth, upload.none(), updateWearCount)
router.route("/deleteItem/:id").delete(userAuth, deleteItem)
router.route("/deleteOutfit/:id").delete(userAuth, deleteOutfit)

router.route("/uploadImage/:id").put(userAuth, uploadHandler, uploadImage)

module.exports = router 
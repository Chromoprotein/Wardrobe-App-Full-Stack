const bcrypt = require("bcryptjs")
// The user schema
const User = require('../User');
const Clothing = require('../Clothing');
const Outfit = require('../Outfit');
const Image = require('../Image')

// User authentication with JSON Web Token
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;

exports.uploadImage = async (req, res) => {
  const newImage = new Image({
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    imageBase64: req.file.buffer.toString('base64'),
    userId: req.id,
    clothingId: req.params.id
  });

  newImage.save()
    .then(image => res.json(image))
    .catch(err => res.status(500).json({ error: err.message }));
}

//exports.fetchImageById = async (req, res) => {
//  Image.findById(req.params.id)
//    .then(image => {
//      if (!image) return res.status(404).json({ error: 'Image not found' });
//
//      res.contentType(image.contentType);
//      res.send(Buffer.from(image.imageBase64, 'base64'));
//    })
//    .catch(err => res.status(500).json({ error: err.message }));
//}

// Lists all the user's books
exports.getClothes = async (req, res) => {
    try {
        // User id comes from the auth middleware
        const userId = req.id;

        // Find the user by ID and populate the books field
        const clothes = await Clothing.find({ user_id: userId });

        if (!clothes) {
            return res.status(404).json({ message: "No clothes found" });
        }

        res.status(200).json({ clothes });
    } catch (error) {
        console.error("Error finding clothes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// View a specific item
exports.getItemById = async (req, res) => {
    try {
        // User id comes from the auth middleware
        const userId = req.id;

        const clothingId = req.params.id;

        console.log("we aere hereee")

        // Find the user by ID and populate the clothing field
        const clothing = await Clothing.findOne({ _id: clothingId, user_id: userId });

        if (!clothing) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ clothing });
    } catch (error) {
        console.error("Error finding the item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.addItem = async (req, res) => {
  try {
    const { category, subcategory, color, formality, season, cost, size, brand, worn_count, img } = req.body;

    // User id comes from authentication middleware
    const user_id = req.id;

    if (!category || !subcategory || !color || !formality || !season || !cost || !size || !brand || !worn_count || !img || !user_id) {
      return res.status(500).json({
        message: "Form information missing or user not found",
      })
    } else {
      const clothing = await Clothing.create({ user_id, category, subcategory, color, formality, season, cost, size, brand, img, worn_count })
      if(clothing) {
        res.status(201).json({
          message: "Clothing successfully created",
          id: clothing._id,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    })
  }

}

exports.updateItem = async (req, res) => {
  try {
    const { category, subcategory, brand, color, size, season, cost, formality, worn_count, img } = req.body
    const clothingId = req.params.id;
    const userId = req.id; // User id from authentication middleware

    // Check that all the data is present
    if (!category || !subcategory || !brand || !color || !size || !season || !cost || !formality || !worn_count || !img || !userId) {
      return res.status(400).json({
        message: "Required information is missing",
      });
    }

    // Check that the clothing document exists and belongs to the user
    const validateItem = await Clothing.findOne({ _id: clothingId, user_id: userId });
    if (!validateItem) {
      return res.status(404).json({ message: "Item not found for this user" });
    }

    // Update the book details
    validateItem.category = category;
    validateItem.subcategory = subcategory;
    validateItem.brand = brand;
    validateItem.color = color;
    validateItem.size = size;
    validateItem.season = season;
    validateItem.cost = cost;
    validateItem.formality = formality;
    validateItem.worn_count = worn_count;
    validateItem.img = img;
    
    await validateItem.save();

    res.json({ message: "Item updated successfully" });
    
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}

exports.deleteItem = async (req, res) => {
    try {
        const userId = req.id; // User id from auth middleware
        const clothingId = req.params.id; // Clothing id from URL parameter

        console.log("test" + userId + clothingId)
        const clothing = await Clothing.findOneAndDelete({ _id: clothingId, user_id: userId });

        if (!clothing) {
            return res.status(404).json({ message: "Item not found or not authorized to delete" });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const bcrypt = require("bcryptjs")
// The user schema
const User = require('../Schemas/User');
const Clothing = require('../Schemas/Clothing');
const Outfit = require('../Schemas/Outfit');
const Image = require('../Schemas/Image')

// User authentication with JSON Web Token
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;

exports.uploadImage = async (req, res) => {

  try {
    const filename = req.file.originalname;
    const contentType = req.file.mimetype;
    const imageBase64 = req.file.buffer.toString('base64');
    const userId = req.id;
    const clothingId = req.params.id;

    // Check that the clothing document exists and belongs to the user
    const validateItem = await Clothing.findOne({ _id: clothingId, user_id: userId });
    if (!validateItem) {
      return res.status(404).json({ message: "Item not found for this user" });
    }

    // Update the book details
    validateItem.filename = filename;
    validateItem.contentType = contentType;
    validateItem.imageBase64 = imageBase64;
    
    await validateItem.save();

    res.status(200).json({
      message: "Clothing successfully updated",
      id: validateItem._id
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
  
}

// Lists all the user's clothes
exports.getClothes = async (req, res) => {
    try {
        // User id comes from the auth middleware
        const userId = req.id;

        // Find the user by ID and populate the books field
        const clothes = await Clothing.find({ user_id: userId }).sort({ createdAt: -1 });

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
    const { category, subcategory, color, formality, season, cost, worn_count, name, brand } = req.body;

    // User id comes from authentication middleware
    const user_id = req.id;

    if (!category || !subcategory || !color || !formality || !season || !cost || !worn_count || !user_id) {
      return res.status(500).json({
        message: "Form information missing or user not found",
      })
    } else {
      const clothing = await Clothing.create({ user_id, category, subcategory, color, formality, season, cost, worn_count, name, brand })
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

exports.addOutfit = async (req, res) => {
  try {
    const { outfitData } = req.body;
    const { clothes, formality, season, color } = outfitData;

    console.log("test" + color)
    // Ensure color is an array
    const colorArray = Array.isArray(color) ? color : color.split(',');

    console.log("testarray " + colorArray)
    // User id comes from authentication middleware
    const user_id = req.id;

    if (!clothes || !user_id) {
      return res.status(500).json({
        message: "Something went wrong, clothes or user missing",
      })
    } else {
      const outfit = await Outfit.create({ user_id, clothes, formality, season, color: colorArray })
      if(outfit) {
        res.status(201).json({
          message: "Outfit successfully saved",
          id: outfit._id,
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

exports.fetchOutfits = async (req, res) => {

  try {
    const user_id = req.id;

    const outfits = await Outfit.find({ user_id: user_id })
      .sort({ createdAt: -1 })
      .populate('clothes')  // This will fetch the associated clothing items
      .exec();
      if(outfits) {
        res.status(200).json({ outfits })
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
    const { category, subcategory, color, season, cost, formality, worn_count, brand, name } = req.body
    const clothingId = req.params.id;
    const userId = req.id; // User id from authentication middleware

    // Check that all the data is present
    if (!category || !subcategory || !color || !season || !cost || !formality || !worn_count || !userId) {
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
    validateItem.color = color;
    validateItem.season = season;
    validateItem.cost = cost;
    validateItem.formality = formality;
    validateItem.worn_count = worn_count;
    validateItem.name = name;
    validateItem.brand = brand;
    
    await validateItem.save();

    res.status(200).json({
      message: "Clothing successfully updated",
      id: validateItem._id
    });

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

exports.deleteOutfit = async (req, res) => {
    try {
        const userId = req.id; // User id from auth middleware
        const outfitId = req.params.id; // Clothing id from URL parameter

        const outfit = await Outfit.findOneAndDelete({ _id: outfitId, user_id: userId });

        if (!outfit) {
            return res.status(404).json({ message: "Item not found or not authorized to delete" });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateWearCount = async (req, res) => {
  try {
    const clothingIds = req.body;
    console.log("test " + clothingIds)
    const clothingIdsArr = Array.isArray(clothingIds) ? clothingIds : clothingIds.split(',');
    const userId = req.id; // User id from authentication middleware

    
    // inc increments fields
    const update = { $inc: { worn_count: 1 } };

    // Check that all the data is present
    if (!clothingIdsArr || !userId) {
      return res.status(400).json({
        message: "Clothes or user were not found",
      });
    }

    const result = await Clothing.updateMany(
      { _id: { $in: clothingIdsArr }, user_id: userId }, // Find all items with these IDs
      update // Apply this update to all matched items
    );

    if(result) {
      res.status(200).json({
        message: "Wear counts successfully updated",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}
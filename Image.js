const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
  filename: String,
  contentType: String,
  imageBase64: String,
  userId: String,
  clothingId: String,
})

module.exports = mongoose.model('Image', imageSchema) 
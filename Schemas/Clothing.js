const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clothingSchema = new Schema({
    user_id: {
        type:String,
        required:true
    },
    category: {
        type:String,
        required:true
    },
    subcategory: {
        type:String,
        required:true,
    },
    color: {
        type:String,
        required:false,
    },
    formality: {
        type:String,
        required:false,
    },
    season: {
        type:String,
        required:false,
    },
    cost: {
        type:Number,
        required:false,
    },
    worn_count: {
        type:Number,
        required:false,
    },
    filename: {
        type:String,
        required:true
    },
    contentType: {
        type:String,
        required:true
    },
    imageBase64: {
        type:String,
        required:true
    },
    name: {
        type:String,
        required:false
    },
    brand: {
        type:String,
        required:false
    }
},{collection : 'clothes', timestamps: true})

module.exports = mongoose.model('Clothing', clothingSchema)
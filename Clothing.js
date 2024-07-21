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
        required:true
    },
    color: {
        type:String,
        required:true
    },
    formality: {
        type:String,
        required:true
    },
    season: {
        type:String,
        required:true
    },
    cost: {
        type:Number,
        required:true
    },
    size: {
        type:String,
        required:true
    },
    brand: {
        type:String,
        required:true
    },
    worn_count: {
        type:Number,
        required:true
    },
    img: {
        type:String,
        required:true
    }
},{collection : 'clothes'})

module.exports = mongoose.model('Clothing', clothingSchema)
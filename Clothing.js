const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clothingSchema = new Schema({
    id: {
        type:String,
        required:true
    },
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
    cpw: {
        type:Number,
        required:true
    }
},{collection : 'clothes'})

module.exports = mongoose.model('Clothing', clothingSchema)
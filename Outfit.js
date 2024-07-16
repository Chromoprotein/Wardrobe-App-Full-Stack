const mongoose = require('mongoose')
const Schema = mongoose.Schema

const outfitSchema = new Schema({
    user_id: {
        type:String,
        required:true
    },
    clothing_ids: {
        type:Array,
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
    worn: {
        type:Number,
        required:true
    }
},{collection : 'outfits'})

module.exports = mongoose.model('Outfit', outfitSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const outfitSchema = new Schema({
    user_id: {
        type:String,
        required:true
    },
    ids: {
        type:Array,
        required:true
    }
},{collection : 'outfits'})

module.exports = mongoose.model('Outfit', outfitSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const outfitSchema = new Schema({
    user_id: {
        type:String,
        required:true
    },
    clothes: [{ type: Schema.Types.ObjectId, ref: 'Clothing' }],
    formality: {
        type:String,
        required:false
    },
    season: {
        type:String,
        required:false
    },
    color: {
        type:Array,
        required:false
    }
},{collection : 'outfits', timestamps: true})

module.exports = mongoose.model('Outfit', outfitSchema)
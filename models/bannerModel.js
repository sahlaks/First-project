const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({
    image1:String,
    image2:String,
    text1:String,
    text2:String,
    description1:String,
    description2:String,
    redirectionUrl:String,
})

const Banner = mongoose.model("Banner",bannerSchema)
module.exports = Banner


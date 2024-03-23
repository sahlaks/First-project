const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({
    image:String,
    text:String,
    description:String,
    redirectionUrl:String,
})

const Banner = mongoose.model("Banner",bannerSchema)
module.exports = Banner


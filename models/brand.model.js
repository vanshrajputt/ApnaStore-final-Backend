const mongoose = require("mongoose")

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand Field is Mendatory"],
        unique: true
    },
    pic: {
        type: String,
        required: [true, "Pic Field is Mendatory"],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }

})

const Brand = new mongoose.model("Brand", BrandSchema)
module.exports = Brand
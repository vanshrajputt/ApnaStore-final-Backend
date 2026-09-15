const mongoose = require("mongoose")

const TestimonialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id Field is Mendatory"],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product Id is Mendatory"],
    },
    star: {
        type: Number,
        default: 5
    },
    message: {
        type: String,
        required: [true, "Message field is mendatory"]
    }

})

const Testimonial = new mongoose.model("Testimonial", TestimonialSchema)
module.exports = Testimonial
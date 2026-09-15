const mongoose = require("mongoose")

const ContactusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Field is Mendatory"],

    },
    email: {
        type: String,
        required: [true, "Email Address Field is Mendatory"],

    },
    phone: {
        type: String,
        required: [true, "Phone Number Field is Mendatory"],

    },
    subject: {
        type: String,
        required: [true, "Subject Field is Mendatory"],

    },
    message: {
        type: String,
        required: [true, "Message Field is Mendatory"],

    },
    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

const Contactus = new mongoose.model("Contactus", ContactusSchema)
module.exports = Contactus
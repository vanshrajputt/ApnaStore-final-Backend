const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User Full Name Field is Mendatory"],

    },
    username: {
        type: String,
        required: [true, "User Name Field is Mendatory"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email Address Field is Mendatory"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone Number Field is Mendatory"],

    },
    password: {
        type: String,
        required: [true, "Password Field is Mendatory"],

    },
    role: {
        type: String,
        default: "Buyer"
    },
    passwordResetOptions: {
        type: Object,
        default: {}
    },
    status: {
        type: Boolean,
        default: true
    },
    address: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            pin: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            }
        }
    ]

})

const User = new mongoose.model("User", UserSchema)
module.exports = User
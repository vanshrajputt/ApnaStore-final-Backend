const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
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
    quantity: {
        type: Number,
        required: [true, "Quantity is Mendatory"]
    },
    color: {
        type: String,
        required: [true, "Color field is mendatory"]
    },
    size: {
        type: String,
        required: [true, "Size field is mendatory"]
    },
    total: {
        type: Number,
        required: [true, "Total Amount Field is Mendatory"]
    }
})

const Cart = new mongoose.model("Cart", CartSchema)
module.exports = Cart
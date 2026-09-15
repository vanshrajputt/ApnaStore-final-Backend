const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Field is Mendatory"],

    },
    maincategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maincategory",
        required: [true, "Maincategory Id is Mendatory"],

    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: [true, "Subcategory Id is Mendatory"],

    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Brand Id is Mendatory"],

    },
    color: {
        type: [String],
        required: [true, "Product color is Mendatory"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Please Provide Atleast One Product Color"
        }

    },
    size: {
        type: [String],
        required: [true, "Product Size is Mendatory"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Please Provide Atleast One Product Size"
        }

    },
    basePrice: {
        type: Number,
        required: [true, "Product Base Price is Mendatory"]
    },
    discount: {
        type: Number,
        required: [true, "Product Discount is Mendatory"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Product Final Price is Mendatory"]
    },
    stock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, "Product StockQuantity is Mendatory"]
    },
    description: {
        type: String,
        default: ""
    },

    pic: {
        type: [String],
        required: [true, "Product Pic is Mendatory"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Please Provide Atleast One Product Pic"
        }

    },
    status: {
        type: Boolean,
        default: true
    }


})

const Product = new mongoose.model("Product", ProductSchema)
module.exports = Product
const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id Field is Mendatory"],
    },
    deliveryAddress: {
        type: Object,
        required: [true, " Delivery Address field is mendatory"]
    },
    orderStatus: {
        type: String,
        default: "Order Has Been Placed"
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    paymentstatus: {
        type: String,
        default: "Pending"
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal Amount field is mendatory"]
    },
    shipping: {
        type: Number,
        required: [true, "Shipping Amount field is mendatory"]
    },
    total: {
        type: Number,
        required: [true, "Total Amount Field is Mendatory"]
    },
    rppid: {
        type: String,
        default: ""                     //raser pay pyment id
    },
    products: {
        type: [{
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
        }],
        required: [true, "Cart Products Are Mendatory"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Please Provide Atleast One Cart Item"
        }

    }
}, { timestamps: true })

const Checkout = new mongoose.model("Checkout", CheckoutSchema)
module.exports = Checkout
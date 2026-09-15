const CheckoutRouter = require("express").Router()
const { verifyBuyer, verifyAdmin, verifySuperadmin } = require("../middleware/auth.middleware")
const { creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord, getUserRecord, order, verifyOrder } = require("../controllers/checkout.controller")

CheckoutRouter.post("", verifyBuyer, creatRecord)
CheckoutRouter.get("", verifyAdmin, getRecord)
CheckoutRouter.get("/:_id", verifyAdmin, getSingleRecord)
CheckoutRouter.get("/user/:user", verifyBuyer, getUserRecord)
CheckoutRouter.put("/:_id", verifyAdmin, updateRecord)
CheckoutRouter.delete("/:_id", verifySuperadmin, deleteRecord)
CheckoutRouter.post("/order", verifyBuyer, order)
CheckoutRouter.post("/verify-order", verifyBuyer, verifyOrder)


module.exports = CheckoutRouter
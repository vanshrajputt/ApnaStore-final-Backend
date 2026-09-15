const WishlistRouter = require("express").Router()
const { verifyBuyer } = require("../middleware/auth.middleware")

const { creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require("../controllers/wishlist.controller")

WishlistRouter.post("",verifyBuyer, creatRecord)
WishlistRouter.get("/", verifyBuyer,getRecord)
// WishlistRouter.get("/user/:_id", verifyBuyer, getRecord)
WishlistRouter.get("/user/:user", verifyBuyer, getRecord)
WishlistRouter.get("/:_id",verifyBuyer, getSingleRecord)
WishlistRouter.put("/:_id",verifyBuyer, updateRecord)
WishlistRouter.delete("/:_id",verifyBuyer, deleteRecord)


module.exports = WishlistRouter
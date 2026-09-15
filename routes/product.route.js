const ProductRouter = require("express").Router()
const { productUploader } = require("../middleware/fileUploade.middleware")
const { verifyPublic,verifyAdmin, verifySuperadmin, verifyBuyer } = require("../middleware/auth.middleware")
const { createRecord, getRecord, getSingleRecord
    , updateRecord, deleteRecord
} = require("../controllers/product.controller")

ProductRouter.post("",verifyAdmin, productUploader.array("pic"), createRecord)
ProductRouter.get("", verifyPublic,getRecord)
ProductRouter.get("/:_id", verifyPublic,getSingleRecord)
ProductRouter.put("/:_id",verifyBuyer, productUploader.array("pic"), updateRecord)
ProductRouter.delete("/:_id",verifySuperadmin, deleteRecord)

module.exports = ProductRouter
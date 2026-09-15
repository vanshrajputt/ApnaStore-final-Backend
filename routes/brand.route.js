const BrandRouter = require("express").Router()
const { brandUploader } = require("../middleware/fileUploade.middleware")

const { createRecord,
     getRecord, 
     getSingleRecord,
     updateRecord,
     deleteRecord
} = require("../controllers/brand.controller")
const {verifyPublic,verifyAdmin,verifySuperadmin} = require("../middleware/auth.middleware")

BrandRouter.post("",verifyAdmin,verifySuperadmin, brandUploader.single("pic"), createRecord)
BrandRouter.get("",verifyPublic, getRecord)
BrandRouter.get("/:_id",verifyPublic, getSingleRecord)
BrandRouter.put("/:_id",verifyAdmin, brandUploader.single("pic"), updateRecord)
BrandRouter.delete("/:_id",verifySuperadmin, deleteRecord)

module.exports = BrandRouter
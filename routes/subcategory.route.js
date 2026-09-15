const SubcategoryRouter = require("express").Router()
const { subcategoryUploader } = require("../middleware/fileUploade.middleware")
const { verifyPublic,verifyAdmin, verifySuperadmin } = require("../middleware/auth.middleware")

const {
    createRecord,
    getRecord,
    getSingalRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/subcategory.controller")

SubcategoryRouter.post("",verifyAdmin, subcategoryUploader.single("pic"), createRecord)
SubcategoryRouter.get("", verifyPublic,getRecord)
SubcategoryRouter.get("/:_id",verifyPublic, getSingalRecord)
SubcategoryRouter.put("/:_id",verifyAdmin, subcategoryUploader.single("pic"), updateRecord)
SubcategoryRouter.delete("/:_id",verifySuperadmin, deleteRecord)

module.exports = SubcategoryRouter
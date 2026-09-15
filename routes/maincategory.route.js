const MaincategoryRouter = require("express").Router()
const { maincategoryUploader } = require("../middleware/fileUploade.middleware")
const { verifyPublic,verifyAdmin, verifySuperadmin } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
    getSingalRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/maincategory.controller")


MaincategoryRouter.post("",verifyAdmin, maincategoryUploader.single("pic"), createRecord)
MaincategoryRouter.get("", verifyPublic,getRecord)
MaincategoryRouter.get("/:_id",verifyPublic, getSingalRecord)
MaincategoryRouter.put("/:_id",verifyAdmin, maincategoryUploader.single("pic"), updateRecord)
MaincategoryRouter.delete("/:_id",verifySuperadmin, deleteRecord)


module.exports = MaincategoryRouter

// single: One pic Uploade
// array : multi pic uploades
// fields: 
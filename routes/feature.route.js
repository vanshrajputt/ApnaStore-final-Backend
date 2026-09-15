const FeatureRouter = require("express").Router()
const { verifyPublic,verifyAdmin, verifySuperadmin } = require("../middleware/auth.middleware")
const { creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require("../controllers/feature.controller")

FeatureRouter.post("",verifyAdmin, creatRecord)
FeatureRouter.get("", verifyPublic,getRecord)
FeatureRouter.get("/:_id",verifyPublic, getSingleRecord)
FeatureRouter.put("/:_id",verifyAdmin, updateRecord)
FeatureRouter.delete("/:_id",verifySuperadmin, deleteRecord)


module.exports = FeatureRouter
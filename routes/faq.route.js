const FaqRouter = require("express").Router()
const { verifyPublic,verifyAdmin, verifySuperadmin } = require("../middleware/auth.middleware")

const { creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require("../controllers/Faq.controller")

FaqRouter.post("",verifyAdmin, creatRecord)
FaqRouter.get("",verifyPublic, getRecord)
FaqRouter.get("/:_id",verifyPublic, getSingleRecord)
FaqRouter.put("/:_id",verifyAdmin, updateRecord)
FaqRouter.delete("/:_id",verifySuperadmin, deleteRecord)


module.exports = FaqRouter
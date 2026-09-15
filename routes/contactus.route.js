const ContactusRouter = require("express").Router()
const { verifyPublic,verifyAdmin, verifySuperadmin } = require("../middleware/auth.middleware")
const { creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord } = require("../controllers/contactus.controller")

ContactusRouter.post("",verifyPublic, creatRecord)
ContactusRouter.get("",verifyAdmin, getRecord)
ContactusRouter.get("/:_id",verifyAdmin, getSingleRecord)
ContactusRouter.put("/:_id",verifyAdmin, updateRecord)
ContactusRouter.delete("/:_id",verifySuperadmin, deleteRecord)


module.exports = ContactusRouter
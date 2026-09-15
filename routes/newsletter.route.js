const NewsletterRouter = require("express").Router()
const { verifyPublic,verifyAdmin, verifySuperadmin, verifyBuyer } = require("../middleware/auth.middleware")

const { creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord,unsubscribe } = require("../controllers/newsletter.controller")

NewsletterRouter.post("",verifyPublic, creatRecord)
NewsletterRouter.get("",verifyAdmin, getRecord)
NewsletterRouter.get("/:_id",verifyAdmin, getSingleRecord)
NewsletterRouter.put("/:_id",verifyAdmin, updateRecord)
NewsletterRouter.delete("/:_id",verifySuperadmin, deleteRecord)
NewsletterRouter.put("/unsubscribe/:_id",verifyBuyer, unsubscribe)



module.exports = NewsletterRouter
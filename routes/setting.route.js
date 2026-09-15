const SettingRouter = require("express").Router()
const { verifyPublic,verifyAdmin } = require("../middleware/auth.middleware")
const { creatRecord, getRecord } = require("../controllers/setting.controller")

SettingRouter.post("",verifyAdmin, creatRecord)
SettingRouter.get("",verifyPublic, getRecord)




module.exports = SettingRouter
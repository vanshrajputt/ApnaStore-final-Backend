const UserRouter = require("express").Router()
const { verifyPublic, verifyBuyer } = require("../middleware/auth.middleware")
const { creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord, login, forgetPassword1
    , forgetPassword2, forgetPassword3
} = require("../controllers/user.controller")


UserRouter.post("", verifyPublic, creatRecord)
UserRouter.get("", verifyBuyer, getRecord)
UserRouter.get("/:_id", verifyBuyer, getSingleRecord)
UserRouter.put("/:_id", verifyBuyer, updateRecord)
UserRouter.delete("/:_id", verifyBuyer, deleteRecord)
UserRouter.post("/login", verifyPublic, login)
UserRouter.post("/forget-password-1", verifyPublic, forgetPassword1)
UserRouter.post("/forget-password-2", verifyPublic, forgetPassword2)
UserRouter.post("/forget-password-3", verifyPublic, forgetPassword3)



module.exports = UserRouter
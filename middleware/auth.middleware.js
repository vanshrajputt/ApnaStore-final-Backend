const jwt = require("jsonwebtoken")


// ================= VERIFY PUBLIC =================

function verifyPublic(req, res, next) {

    let token = req.headers.authorization

    try {

        jwt.verify(token, process.env.JWT_SECRET_KEY)

        next()

    } catch (error) {

        res.status(401).send({
            result: "Fail",
            reason: "You Are not Authorized to Access this API"
        })

    }

}


// ================= VERIFY SUPER ADMIN =================

function verifySuperadmin(req, res, next) {

    let token = req.headers.authorization

    try {

        let decode = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        )

        if (["Super Admin"].includes(decode.data.role)) {

            next()

        } else {

            res.status(401).send({
                result: "Fail",
                reason: "You Are not Authorized to Access this API"
            })

        }

    } catch (error) {

        res.status(401).send({
            result: "Fail",
            reason:
                error.message === "invalid signature" ||
                error.message === "jwt must be provided"
                    ? "You Are not Authorized to Access this API"
                    : "Your Login Session Has been Expired, Please Login Again"
        })

    }

}


// ================= VERIFY ADMIN =================

function verifyAdmin(req, res, next) {

    let token = req.headers.authorization

    try {

        let decode = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        )

        if (
            ["Super Admin", "Admin"].includes(
                decode.data.role
            )
        ) {

            next()

        } else {

            res.status(401).send({
                result: "Fail",
                reason: "You Are not Authorized to Access this API"
            })

        }

    } catch (error) {

        res.status(401).send({
            result: "Fail",
            reason:
                error.message === "invalid signature" ||
                error.message === "jwt must be provided"
                    ? "You Are not Authorized to Access this API"
                    : "Your Login Session Has been Expired, Please Login Again"
        })

    }

}


// ================= VERIFY BUYER =================

function verifyBuyer(req, res, next) {

    let token = req.headers.authorization

    try {

        let decode = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        )

        if (
            ["Super Admin", "Admin", "Buyer"].includes(
                decode.data.role
            )
        ) {

            next()

        } else {

            res.status(401).send({
                result: "Fail",
                reason: "You Are not Authorized to Access this API"
            })

        }

    } catch (error) {

        res.status(401).send({
            result: "Fail",
            reason:
                error.message === "invalid signature" ||
                error.message === "jwt must be provided"
                    ? "You Are not Authorized to Access this API"
                    : "Your Login Session Has been Expired, Please Login Again"
        })

    }

}


// ================= EXPORT =================

module.exports = {
    verifyPublic,
    verifySuperadmin,
    verifyAdmin,
    verifyBuyer
}
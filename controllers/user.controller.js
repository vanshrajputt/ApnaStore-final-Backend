const User = require("../models/user.model")
const passwordValidator = require('password-validator');
const bcrypt = require("bcrypt")
const mailer = require("../helper/mailer.helper")
const jwt = require("jsonwebtoken")
// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                              // Must have uppercase letters
    .has().lowercase(1)                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().symbols(1)                                // Must have at least 1 syblos
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'Admin@123', 'User@123']); // Blacklist these values


async function creatRecord(req, res) {
    if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body?.password, 12, async (error, hash) => {
            if (error) {

                res.status(400).send({
                    result: "Fail",
                    reason: "Internal Server Error"
                })

            } else {
                try {
                    let data = new User(req.body)
                    data.password = hash

                    await data.save();
                    res.send({
                        result: "Done",
                        data: data
                    })
                    mailer.sendMail({
                        from: process.env.MAIL_USERNAME,
                        to: data.email,
                        subject: `Your Account Has Been Created : Team ${process.env.SITE_NAME}`,
                        html: `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:30px 15px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;">
    <tr>
        <td align="center">

            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:45px;text-align:center;">

                        <div style="display:inline-block;width:75px;height:75px;line-height:75px;background:#ffffff;border-radius:50%;font-size:34px;">
                            🛍️
                        </div>

                        <h1 style="margin:18px 0 8px;color:#ffffff;font-size:34px;font-weight:700;">
                            ${process.env.SITE_NAME}
                        </h1>

                        <p style="margin:0;color:#dbeafe;font-size:15px;">
                            Everything You Need. Delivered With Trust.
                        </p>

                    </td>
                </tr>

                <!-- Welcome -->
                <tr>
                    <td style="padding:45px 40px 20px;text-align:center;">

                        <div style="font-size:60px;">
                            🎉
                        </div>

                        <h2 style="margin:18px 0 12px;color:#111827;font-size:30px;">
                            Welcome to ${process.env.SITE_NAME}!
                        </h2>

                        <p style="margin:0;color:#4b5563;font-size:16px;line-height:28px;">
                            Hi <strong>${data.name}</strong>,
                            <br><br>
                            Your account has been successfully created.
                            We're excited to have you as a part of our shopping community.
                        </p>

                    </td>
                </tr>

                <!-- Account Created -->
                <tr>
                    <td style="padding:20px 40px;">

                        <table width="100%" cellpadding="18" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;">

                            <tr>
                                <td colspan="2" style="color:#1e3a8a;font-size:19px;font-weight:bold;padding-bottom:20px;">
                                    👤 Your Account Details
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    Name
                                </td>

                                <td align="right" style="color:#111827;font-weight:600;">
                                    ${data.name}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    Email
                                </td>

                                <td align="right">
                                    <span style="color:#2563eb;font-weight:600;">
                                        ${data.email}
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    Account Status
                                </td>

                                <td align="right">
                                    <span style="background:#dcfce7;color:#15803d;padding:7px 16px;border-radius:20px;font-size:13px;font-weight:bold;">
                                        Active
                                    </span>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- Message -->
                <tr>
                    <td style="padding:25px 40px;">

                        <h3 style="margin:0 0 12px;color:#111827;font-size:21px;">
                            🛒 Start Shopping
                        </h3>

                        <p style="margin:0;color:#4b5563;font-size:15px;line-height:28px;">
                            Your account is ready! Explore our latest products,
                            discover exciting deals, add your favourite products
                            to your cart and enjoy a smooth shopping experience.
                        </p>

                    </td>
                </tr>

                <!-- CTA -->
                <tr>
                    <td style="padding:10px 40px 35px;text-align:center;">

                        <a href="${process.env.SITE_URL}"
                           style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:16px 42px;border-radius:8px;font-size:17px;font-weight:bold;">
                            🛒 Start Shopping
                        </a>

                    </td>
                </tr>

                <!-- Benefits -->
                <tr>
                    <td style="padding:10px 40px 35px;">

                        <table width="100%" cellpadding="10">

                            <tr>
                                <td style="color:#374151;">
                                    🚚 Fast & Secure Delivery
                                </td>

                                <td style="color:#374151;">
                                    🔒 Secure Payments
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#374151;">
                                    💯 Quality Products
                                </td>

                                <td style="color:#374151;">
                                    🔄 Easy Returns
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#374151;">
                                    🎁 Exciting Offers
                                </td>

                                <td style="color:#374151;">
                                    ⭐ Customer Support
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- Support -->
                <tr>
                    <td style="padding:0 40px 35px;">

                        <div style="background:#eff6ff;border-left:5px solid #2563eb;border-radius:10px;padding:20px;">

                            <h3 style="margin:0 0 8px;color:#1e3a8a;font-size:17px;">
                                Need Help?
                            </h3>

                            <p style="margin:0;color:#374151;font-size:14px;line-height:24px;">
                                If you have any questions or need assistance,
                                our customer support team is always happy to help.
                            </p>

                        </div>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#111827;padding:35px;text-align:center;">

                        <h3 style="margin:0;color:#ffffff;font-size:20px;">
                            Thank You for Joining ${process.env.SITE_NAME} ❤️
                        </h3>

                        <p style="margin:12px 0;color:#9ca3af;font-size:13px;line-height:23px;">
                            We're happy to have you with us.
                            Enjoy your shopping experience!
                        </p>

                        <a href="${process.env.SITE_URL}"
                           style="color:#60a5fa;text-decoration:none;font-size:14px;font-weight:600;">
                            Visit Our Website
                        </a>

                        <p style="margin:20px 0 0;color:#6b7280;font-size:12px;">
                            © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>
`
                    }, (error) => {
                        console.log(error)
                    })
                } catch (error) {
                    let errorMessage;
                    if (error.keyValue) {
                        errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                            key, `User with this ${key} Already Exist`
                        ]))

                    }
                    else {
                        errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [
                            key, error.errors[key].message
                        ]))
                    } if (Object.values(errorMessage).length !== 0) {
                        res.status(400).send({
                            result: "Fail",
                            reason: errorMessage
                        })

                    } else
                        res.status(500).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })

                }
            }
        })
    }
    else {
        res.status(400).send({
            result: "Fail",
            reason: schema.validate(req.body?.password, { details: true }).map(x => x.message.replaceAll("string", "Password")).join("|")
        })
    }

}
async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            data: data,
            count: data.length
        })

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal server Error"
        })

    }


}
async function getSingleRecord(req, res) {

    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "No Such Data"
            })
        }

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })

    }

}
async function updateRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Data Available"
            })
        }
        data.name = req.body.name ?? data.name;
        data.username = req.body.username ?? data.username;
        data.email = req.body.email ?? data.email
        data.phone = req.body.phone ?? data.phone
        data.status = req.body.status ?? data.status
        data.role = req.body.role ?? data.role
        data.address = req.body.address ?? data.address


        await data.save()
        res.status(200).send({
            result: "Done",
            data: data
        })
    } catch (error) {

        let errorMessage;
        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, `User With this ${key} Already Exist`
            ]))

        }
        else {
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [
                key, error.errors[key].message
            ]))
        } if (Object.values(errorMessage).length !== 0) {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })

        } else
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })


    }

}
async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
        }
        res.send({
            result: "Done"
        })

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })

    }

}
async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username },
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let token = jwt.sign({ data }, process.env.JWT_SECRET_KEY, { expiresIn: "15 days" })
                res.send({
                    result: "Done",
                    data: data,
                    token: token
                })

            } else {
                res.status(401).send({
                    result: "Fail",
                    reason: "Invalid Username or Password"
                })

            }

        } else {
            res.status(401).send({
                result: "Fail",
                reason: "Invalid Username or Password"
            })
        }


    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })

    }

}
async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username },
            ]
        })
        if (data) {
            let otp = Number(Math.random().toString().slice(2, 8).toString().padEnd(6, "1"))
            data.passwordResetOptions = {
                otp: otp,
                date: new Date()
            }
            await data.save()
            res.send({
                result: "Done",
                message: "OTP Has Been Send Your Registerd Email Address"
            })
            mailer.sendMail({
                from: process.env.MAIL_USERNAME,
                to: data.email,
                subject: `OTP for Password Reset: Team ${process.env.SITE_NAME}`,
                html: `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:30px 15px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;">
    <tr>
        <td align="center">

            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:40px;text-align:center;">

                        <div style="display:inline-block;width:75px;height:75px;line-height:75px;background:#ffffff;border-radius:50%;font-size:34px;">
                            🔐
                        </div>

                        <h1 style="margin:18px 0 8px;color:#ffffff;font-size:34px;font-weight:700;">
                            ${process.env.SITE_NAME}
                        </h1>

                        <p style="margin:0;color:#dbeafe;font-size:15px;">
                            Account Security
                        </p>

                    </td>
                </tr>

                <!-- Main Content -->
                <tr>
                    <td style="padding:45px 40px 25px;text-align:center;">

                        <div style="font-size:55px;">
                            🔑
                        </div>

                        <h2 style="margin:18px 0 12px;color:#111827;font-size:29px;">
                            Password Reset Request
                        </h2>

                        <p style="margin:0;color:#4b5563;font-size:16px;line-height:28px;">
                            Hi <strong>${data.name}</strong>,
                            <br><br>

                            We received a request to reset the password
                            for your ${process.env.SITE_NAME} account.
                        </p>

                    </td>
                </tr>

                <!-- OTP Section -->
                <tr>
                    <td style="padding:15px 40px 30px;text-align:center;">

                        <p style="margin:0 0 15px;color:#6b7280;font-size:15px;">
                            Your One-Time Password (OTP) is:
                        </p>

                        <div style="display:inline-block;background:#eff6ff;border:2px dashed #2563eb;border-radius:14px;padding:20px 45px;">

                            <span style="font-size:38px;letter-spacing:10px;font-weight:700;color:#1d4ed8;">
                                ${otp}
                            </span>

                        </div>

                        <p style="margin:18px 0 0;color:#6b7280;font-size:14px;">
                            This OTP is valid for <strong>10 minutes</strong>.
                        </p>

                    </td>
                </tr>

                <!-- Security Warning -->
                <tr>
                    <td style="padding:10px 40px 35px;">

                        <div style="background:#fff7ed;border-left:5px solid #f59e0b;border-radius:10px;padding:22px;">

                            <h3 style="margin:0 0 10px;color:#92400e;font-size:18px;">
                                ⚠️ Important Security Notice
                            </h3>

                            <p style="margin:0;color:#78350f;font-size:14px;line-height:25px;">
                                Never share this OTP with anyone.
                                ${process.env.SITE_NAME} support team will never ask you
                                for your OTP or account password.
                            </p>

                        </div>

                    </td>
                </tr>

                <!-- Instructions -->
                <tr>
                    <td style="padding:5px 40px 35px;">

                        <h3 style="margin:0 0 15px;color:#111827;font-size:20px;">
                            🔒 What Should You Do?
                        </h3>

                        <table width="100%" cellpadding="10">

                            <tr>
                                <td style="color:#374151;font-size:15px;">
                                    1️⃣ Enter this OTP on the password reset page.
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#374151;font-size:15px;">
                                    2️⃣ Create a new secure password.
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#374151;font-size:15px;">
                                    3️⃣ If you didn't request this reset, you can safely ignore this email.
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- Expiry -->
                <tr>
                    <td style="padding:0 40px 35px;text-align:center;">

                        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:18px;">

                            <p style="margin:0;color:#6b7280;font-size:14px;">
                                ⏱ OTP Expiry
                            </p>

                            <p style="margin:7px 0 0;color:#111827;font-size:16px;font-weight:bold;">
                                10 Minutes
                            </p>

                        </div>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#111827;padding:35px;text-align:center;">

                        <h3 style="margin:0;color:#ffffff;font-size:20px;">
                            ${process.env.SITE_NAME} 🔐
                        </h3>

                        <p style="margin:12px 0;color:#9ca3af;font-size:13px;line-height:23px;">
                            Your security is important to us.
                            Thank you for choosing ${process.env.SITE_NAME}.
                        </p>

                        <a href="${process.env.SITE_URL}"
                           style="color:#60a5fa;text-decoration:none;font-size:14px;font-weight:600;">
                            Visit Our Website
                        </a>

                        <p style="margin:20px 0 0;color:#6b7280;font-size:12px;">
                            © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>
`
            }, (error) => {
                console.log(error)
            })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "No User record Found"
            })

        }

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })

    }

}
async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username },
            ]
        })
        if (data) {
            if (data.passwordResetOptions.otp == req.body.otp) {
                if ((Date.now() - data.passwordResetOptions.date) > 600000) {
                    res.status(400).send({
                        result: "Fail",
                        reason: "OTP Has Been Expired Please Try Again"
                    })
                }
                else {
                    res.send({
                        result: "Done",
                    })

                }

            }
            else {
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid OTP"
                })

            }
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "Unauthorized Activity"
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })

    }

}
async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username },
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body?.password, 12, async (error, hash) => {
                    if (error) {

                        res.status(400).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })

                    } else {
                        data.password = hash
                        await data.save();
                        res.send({
                            result: "Done",
                            data: data
                        })
                        mailer.sendMail({
                            from: process.env.MAIL_USERNAME,
                            to: data.email,
                            subject: `Password Has Been Reset Succesfully : Team ${process.env.SITE_NAME}`,
                            html: `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:30px 15px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;">
    <tr>
        <td align="center">

            <table width="100%" cellpadding="0" cellspacing="0"
                style="max-width:700px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:45px;text-align:center;">

                        <div style="display:inline-block;width:75px;height:75px;line-height:75px;background:#ffffff;border-radius:50%;font-size:34px;">
                            🛍️
                        </div>

                        <h1 style="margin:18px 0 8px;color:#ffffff;font-size:34px;font-weight:700;">
                            ${process.env.SITE_NAME}
                        </h1>

                        <p style="margin:0;color:#dbeafe;font-size:15px;">
                            Account Security
                        </p>

                    </td>
                </tr>

                <!-- Success -->
                <tr>
                    <td style="padding:45px 40px 25px;text-align:center;">

                        <div style="font-size:65px;">
                            ✅
                        </div>

                        <h2 style="margin:18px 0 12px;color:#111827;font-size:30px;">
                            Password Has Been Reset Successfully
                        </h2>

                        <p style="margin:0;color:#4b5563;font-size:16px;line-height:28px;">
                            Hi <strong>${data.name}</strong>,
                            <br><br>

                            Your ${process.env.SITE_NAME} account password has been
                            successfully changed.
                        </p>

                    </td>
                </tr>

                <!-- Status Card -->
                <tr>
                    <td style="padding:20px 40px;">

                        <table width="100%" cellpadding="18" cellspacing="0"
                            style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;">

                            <tr>
                                <td colspan="2"
                                    style="color:#1e3a8a;font-size:19px;font-weight:bold;padding-bottom:20px;">
                                    🔐 Password Reset Details
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    👤 Account
                                </td>

                                <td align="right"
                                    style="color:#111827;font-weight:600;">
                                    ${data.name}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    📩 Registered Email
                                </td>

                                <td align="right"
                                    style="color:#2563eb;font-weight:600;">
                                    ${data.email}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    📅 Reset Date
                                </td>

                                <td align="right"
                                    style="color:#111827;">
                                    ${new Date().toLocaleString("en-IN")}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    📌 Status
                                </td>

                                <td align="right">
                                    <span style="display:inline-block;background:#dcfce7;color:#15803d;padding:7px 16px;border-radius:20px;font-size:13px;font-weight:bold;">
                                        Password Updated
                                    </span>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- Security Notice -->
                <tr>
                    <td style="padding:30px 40px 35px;">

                        <div style="background:#fff7ed;border-left:5px solid #f59e0b;border-radius:10px;padding:22px;">

                            <h3 style="margin:0 0 10px;color:#92400e;font-size:18px;">
                                ⚠️ Didn't Reset Your Password?
                            </h3>

                            <p style="margin:0;color:#78350f;font-size:14px;line-height:25px;">
                                If you did not make this change, your account may be
                                at risk. Please reset your password immediately and
                                contact our support team.
                            </p>

                        </div>

                    </td>
                </tr>

                <!-- CTA -->
                <tr>
                    <td style="padding:0 40px 40px;text-align:center;">

                        <a href="${process.env.SITE_URL}"
                           style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:16px 42px;border-radius:8px;font-size:17px;font-weight:bold;">
                            🛒 Continue Shopping
                        </a>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#111827;padding:35px;text-align:center;">

                        <h3 style="margin:0;color:#ffffff;font-size:20px;">
                            ${process.env.SITE_NAME} 🔐
                        </h3>

                        <p style="margin:12px 0;color:#9ca3af;font-size:13px;line-height:23px;">
                            Your account security is important to us.
                            Thank you for choosing ${process.env.SITE_NAME}.
                        </p>

                        <a href="${process.env.SITE_URL}"
                           style="color:#60a5fa;text-decoration:none;font-size:14px;font-weight:600;">
                            Visit Our Website
                        </a>

                        <p style="margin:20px 0 0;color:#6b7280;font-size:12px;">
                            © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>
`
                        }, (error) => {
                            console.log(error)
                        })

                    }
                })
            }
            else {
                res.status(400).send({
                    result: "Fail",
                    reason: schema.validate(req.body?.password, { details: true }).map(x => x.message.replaceAll("string", "Password")).join("|")
                })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })

    }

}

module.exports = {
    creatRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3
}
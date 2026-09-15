const Newsletter = require("../models/newsletter.model")
const mailer = require("../helper/mailer.helper")
async function creatRecord(req, res) {
    try {

        var data = new Newsletter(req.body)
        await data.save()

        // NEWSLETTER CONFIRMATION MAIL

        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: data.email,

            subject: `🎉 Newsletter Subscription Confirmed | ${process.env.SITE_NAME}`,

            html: `
<table width="100%" cellpadding="0" cellspacing="0"
style="
margin:0;
padding:30px 15px;
background:#f3f6fa;
font-family:Arial,Helvetica,sans-serif;
">

<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0"
style="
max-width:650px;
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 10px 35px rgba(0,0,0,.08);
">

<!-- HEADER -->

<tr>
<td style="
background:linear-gradient(135deg,#0f172a,#2563eb);
padding:45px 30px;
text-align:center;
">

<div style="
display:inline-block;
width:75px;
height:75px;
line-height:75px;
background:#ffffff;
border-radius:50%;
font-size:34px;
">

📩

</div>

<h1 style="
margin:18px 0 8px;
color:#ffffff;
font-size:32px;
">

${process.env.SITE_NAME}

</h1>

<p style="
margin:0;
color:#dbeafe;
font-size:15px;
">

Newsletter Subscription

</p>

</td>
</tr>


<!-- SUCCESS -->

<tr>
<td style="
padding:45px 35px 25px;
text-align:center;
">

<div style="font-size:60px;">
🎉
</div>

<h2 style="
margin:18px 0 12px;
color:#111827;
font-size:28px;
">

Subscription Confirmed!

</h2>

<p style="
margin:0;
color:#4b5563;
font-size:16px;
line-height:28px;
">

Hello,

<br><br>

Thank you for subscribing to the
<strong>${process.env.SITE_NAME}</strong>
newsletter.

<br><br>

You have successfully joined our newsletter.
You will now receive our latest updates,
offers, products and news directly in your inbox.

</p>

</td>
</tr>


<!-- EMAIL INFORMATION -->

<tr>
<td style="padding:20px 35px 30px;">

<table width="100%" cellpadding="18" cellspacing="0"
style="
background:#f8fafc;
border:1px solid #e5e7eb;
border-radius:14px;
">

<tr>

<td style="
color:#6b7280;
font-size:14px;
">

📧 Subscribed Email

</td>

<td align="right"
style="
color:#111827;
font-weight:600;
font-size:14px;
">

${data.email}

</td>

</tr>

<tr>

<td style="
color:#6b7280;
font-size:14px;
">

📅 Subscription Date

</td>

<td align="right"
style="
color:#111827;
font-size:14px;
">

${new Date().toLocaleString("en-IN")}

</td>

</tr>

</table>

</td>
</tr>


<!-- MESSAGE -->

<tr>
<td style="padding:0 35px 30px;">

<div style="
background:#eff6ff;
border-left:5px solid #2563eb;
border-radius:10px;
padding:22px;
">

<h3 style="
margin:0 0 10px;
color:#1e3a8a;
font-size:18px;
">

💙 You're All Set!

</h3>

<p style="
margin:0;
color:#1e40af;
font-size:14px;
line-height:25px;
">

Keep an eye on your inbox.
We'll send you the latest updates,
special offers and exciting news from
<strong>${process.env.SITE_NAME}</strong>.

</p>

</div>

</td>
</tr>


<!-- CTA -->

<tr>
<td style="
padding:5px 35px 40px;
text-align:center;
">

<a href="${process.env.SITE_URL}"
style="
display:inline-block;
background:#2563eb;
color:#ffffff;
text-decoration:none;
padding:15px 38px;
border-radius:8px;
font-size:16px;
font-weight:bold;
">

🛒 Visit ${process.env.SITE_NAME}

</a>

</td>
</tr>


<!-- FOOTER -->

<tr>

<td style="
background:#111827;
padding:30px;
text-align:center;
">

<h3 style="
margin:0;
color:#ffffff;
font-size:19px;
">

${process.env.SITE_NAME} 🛍️

</h3>

<p style="
margin:12px 0;
color:#9ca3af;
font-size:13px;
line-height:22px;
">

Thank you for subscribing to our newsletter.

<br>

We appreciate your support.

</p>

<a href="${process.env.SITE_URL}"
style="
color:#60a5fa;
text-decoration:none;
font-size:14px;
font-weight:600;
">

Visit Our Website

</a>

<p style="
margin:18px 0 0;
color:#6b7280;
font-size:12px;
">

© 2026 ${process.env.SITE_NAME}.
All Rights Reserved.

</p>

</td>

</tr>

</table>

</td>
</tr>

</table>
`
        }, (error) => {

            if (error) {
                console.log("Newsletter Confirmation Mail Error:", error);
            } else {
                console.log("Newsletter Confirmation Mail Sent Successfully");
            }

        });


        // API RESPONSE

        res.send({
            result: "Done",
            data: data
        })

    } catch (error) {

        if (error.keyValue) {

            res.send({
                result: "Done",
                data: data
            })


        }
        else {

            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })

        }

    }
}
async function getRecord(req, res) {
    try {
        let data = await Newsletter.find().sort({ _id: -1 })
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
        let data = await Newsletter.findOne({ _id: req.params._id })
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
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Data Available"
            })
        }

        data.status = req.body.status ?? data.status


        await data.save()
        res.status(200).send({
            result: "Done",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })


    }

}
async function unsubscribe(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Data Available"
            })
        }

        data.status = false


        await data.save()
        res.status(200).send({
            result: "Done",
            result: "Newsletter Unsubscribed"
        })
    } catch (error) {
        return res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })


    }

}
async function deleteRecord(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
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

module.exports = {
    creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord, unsubscribe
}
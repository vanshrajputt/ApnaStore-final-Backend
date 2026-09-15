const Contactus = require("../models/contactus.model")
const mailer = require("../helper/mailer.helper")
async function creatRecord(req, res) {
    try {
        let data = new Contactus(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })
        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: data.email,
            subject: `Your Query Has Been Recevied : Team ${process.env.SITE_NAME}`,
            html: `
             <table width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;margin:auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:50px;text-align:center;">

<div style="display:inline-block;width:90px;height:90px;line-height:90px;background:#ffffff;border-radius:50%;font-size:42px;">
🛍️
</div>

<h1 style="margin:20px 0 10px;font-size:42px;color:#ffffff;font-weight:700;">
${process.env.SITE_NAME}
</h1>

<p style="margin:0;font-size:18px;color:#dbeafe;">
Everything You Need. Delivered With Trust.
</p>

</td>
</tr>

<!-- Hero -->
<tr>
<td style="padding:45px 45px 20px;text-align:center;">

<div style="font-size:75px;">✅</div>

<h2 style="margin:20px 0 15px;color:#111827;font-size:34px;">
We've Successfully Received Your Query!
</h2>

<p style="margin:0;font-size:16px;line-height:32px;color:#4b5563;">
Hello <strong>${data.name}</strong>,
<br><br>

Thank you for reaching out to <strong>${process.env.SITE_NAME}</strong>.
We appreciate you taking the time to contact us.

Your request has been successfully received and assigned to one of our customer support specialists. Our team is already reviewing your query and will get back to you with the best possible solution.
</p>

</td>
</tr>

<!-- Ticket Card -->

<tr>
<td style="padding:10px 45px;">

<table width="100%" cellpadding="18" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;">

<tr>
<td colspan="2" style="font-size:20px;font-weight:bold;color:#1e3a8a;">
📋 Support Request Details
</td>
</tr>

<tr>
<td style="color:#6b7280;">🎫Reference ID</td>
<td align="right"><strong>${data._id}</strong></td>
</tr>

<tr>
<td style="color:#6b7280;">📩 Registered Email</td>
<td align="right">${data.email}</td>
</tr>
<tr>
    <td style="color:#6b7280;">📝 Subject</td>
    <td align="right">${data.subject}</td>
</tr>
<tr>
    <td style="color:#6b7280;">📅 Submitted On</td>
    <td align="right">${data.createdAt}</td>
</tr>

<tr>
<td style="color:#6b7280;">⏳ Current Status</td>
<td align="right">
<span style="background:#dcfce7;color:#15803d;padding:8px 18px;border-radius:20px;font-size:13px;font-weight:bold;">
Received
</span>
</td>
</tr>

<tr>
<td style="color:#6b7280;">⏱ Expected Response</td>
<td align="right"><strong>Within 24–48 Business Hours</strong></td>
</tr>

</table>

</td>
</tr>

<!-- Process -->

<tr>
<td style="padding:35px 45px 15px;">

<h2 style="margin-top:0;color:#111827;">
🚀 What Happens Next?
</h2>

<table width="100%" cellpadding="12">

<tr>
<td>✔️ Your message has been securely recorded.</td>
</tr>

<tr>
<td>✔️ Our dedicated support team is reviewing your concern.</td>
</tr>

<tr>
<td>✔️ If more information is needed, we'll contact you via email.</td>
</tr>

<tr>
<td>✔️ You'll receive a detailed reply as quickly as possible.</td>
</tr>

</table>

</td>
</tr>

<!-- Offer Section -->

<tr>
<td style="padding:20px 45px;">

<table width="100%" cellpadding="25" cellspacing="0" style="background:linear-gradient(135deg,#2563eb,#4f46e5);border-radius:16px;">

<tr>
<td align="center">

<h2 style="margin:0;color:#ffffff;">
🎉 Don't Miss Our Latest Deals!
</h2>

<p style="margin:20px 0;color:#e5e7eb;font-size:16px;line-height:30px;">
While our support team works on your request,
explore thousands of products, exclusive offers,
new arrivals, and exciting discounts available on ${process.env.SITE_NAME}.
</p>

<a href="${process.env.SITE_URL}"
style="display:inline-block;padding:16px 42px;background:#ffffff;color:#2563eb;text-decoration:none;border-radius:8px;font-size:17px;font-weight:bold;">
🛒 Continue Shopping
</a>

</td>
</tr>

</table>

</td>
</tr>

<!-- Why Choose -->

<tr>
<td style="padding:35px 45px;">

<h2 style="margin-top:0;color:#111827;">
❤️ Why Shop With ${process.env.SITE_NAME}?
</h2>

<table width="100%" cellpadding="10">

<tr>
<td>🚚 Fast & Secure Delivery</td>
<td>🔒 100% Secure Payments</td>
</tr>

<tr>
<td>💯 Genuine Products</td>
<td>🎁 Exclusive Deals</td>
</tr>

<tr>
<td>🔄 Easy Returns</td>
<td>⭐ Premium Customer Support</td>
</tr>

</table>

</td>
</tr>

<!-- Support -->

<tr>
<td style="padding:0 45px 35px;">

<div style="background:#fff8e7;border-left:5px solid #f59e0b;padding:25px;border-radius:12px;">

<h3 style="margin-top:0;color:#92400e;">
Need Immediate Assistance?
</h3>

<p style="margin-bottom:0;color:#555;line-height:30px;">
Simply reply to this email and our support team will assist you as soon as possible.
Your satisfaction is our highest priority.
</p>

</div>

</td>
</tr>

<!-- Footer -->

<tr>
<td style="background:linear-gradient(135deg,#2d4782,#5fbed6);padding:45px;text-align:center;">

<h2 style="margin:0;color:#ffffff;">
Thank You For Choosing ${process.env.SITE_NAME} ❤️
</h2>

<p style="margin:18px 0;color:#d1d5db;font-size:15px;line-height:30px;">
We're grateful for your trust and look forward to serving you again.
Your support inspires us to deliver the best shopping experience every day.
</p>

<div style="text-center">

<a href="${process.env.SITE_URL}" style="color:#111827;text-decoration:none;margin:0 12px;">Our Website</a>

</div>

<p style="margin:0;color:black;font-size:13px;">
© 2026 ${process.env.SITE_NAME}. All Rights Reserved.
</p>

</td>
</tr>

</table>`
        }, (error) => {
            console.log(error)
        })

        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: process.env.MAIL_USERNAME,
            subject: `New Contact Us Query  Recevied : Team ${process.env.SITE_NAME}`,
            html: `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:30px 15px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;">
    <tr>
        <td align="center">

            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:40px;text-align:center;">

                        <div style="display:inline-block;width:70px;height:70px;line-height:70px;background:#ffffff;border-radius:50%;font-size:32px;">
                            🛍️
                        </div>

                        <h1 style="margin:18px 0 8px;color:#ffffff;font-size:32px;">
                            ${process.env.SITE_NAME}
                        </h1>

                        <p style="margin:0;color:#dbeafe;font-size:15px;">
                            Admin Notification
                        </p>

                    </td>
                </tr>

                <!-- Main Heading -->
                <tr>
                    <td style="padding:40px 40px 20px;text-align:center;">

                        <div style="font-size:55px;">
                            🔔
                        </div>

                        <h2 style="margin:15px 0 10px;color:#111827;font-size:28px;">
                            New Contact Us Query
                        </h2>

                        <p style="margin:0;color:#6b7280;font-size:15px;line-height:26px;">
                            A new customer query has been received through your website.
                        </p>

                    </td>
                </tr>

                <!-- Query Details -->
                <tr>
                    <td style="padding:15px 40px;">

                        <table width="100%" cellpadding="15" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;">

                            <tr>
                                <td colspan="2" style="color:#1e3a8a;font-size:19px;font-weight:bold;padding-bottom:20px;">
                                    📋 Query Details
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;width:40%;">
                                    👤 Customer Name
                                </td>

                                <td align="right" style="color:#111827;font-weight:600;">
                                    ${data.name}
                                </td>
                            </tr>
                             <tr>
                                <td style="color:#6b7280;width:40%;">
                                    📞 Phone
                                </td>

                                <td align="right" style="color:#111827;font-weight:600;">
                                    ${data.phone}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    📩 Email
                                </td>

                                <td align="right">
                                    <a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;font-weight:600;">
                                        ${data.email}
                                    </a>
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    📝 Subject
                                </td>

                                <td align="right" style="color:#111827;font-weight:600;">
                                    ${data.subject}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    📅 Submitted On
                                </td>

                                <td align="right" style="color:#111827;">
                                    ${data.createdAt}
                                </td>
                            </tr>

                            <tr>
                                <td style="color:#6b7280;">
                                    📌 Status
                                </td>

                                <td align="right">
                                    <span style="display:inline-block;background:#dcfce7;color:#15803d;padding:7px 16px;border-radius:20px;font-size:13px;font-weight:bold;">
                                        New Query
                                    </span>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- Message -->
                <tr>
                    <td style="padding:30px 40px;">

                        <h3 style="margin:0 0 15px;color:#111827;font-size:20px;">
                            💬 Customer Message
                        </h3>

                        <div style="background:#f8fafc;border-left:5px solid #2563eb;border-radius:10px;padding:22px;">

                            <p style="margin:0;color:#374151;font-size:15px;line-height:28px;">
                                ${data.message}
                            </p>

                        </div>

                    </td>
                </tr>

                <!-- Action -->
                <tr>
                    <td style="padding:5px 40px 40px;text-align:center;">

                        <a href="mailto:${data.email}?subject=Re: ${data.subject}"
                           style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:15px 35px;border-radius:8px;font-size:16px;font-weight:bold;">
                            ✉️ Reply to Customer
                        </a>

                    </td>
                </tr>

                <!-- Alert -->
                <tr>
                    <td style="padding:0 40px 35px;">

                        <div style="background:#fff7ed;border-left:5px solid #f97316;border-radius:10px;padding:20px;">

                            <h3 style="margin:0 0 8px;color:#9a3412;font-size:17px;">
                                ⚡ Action Required
                            </h3>

                            <p style="margin:0;color:#7c2d12;font-size:14px;line-height:24px;">
                                Please review this query and respond to the customer as soon as possible.
                            </p>

                        </div>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#111827;padding:30px;text-align:center;">

                        <h3 style="margin:0;color:#ffffff;font-size:20px;">
                            ${process.env.SITE_NAME}
                        </h3>

                        <p style="margin:10px 0;color:#9ca3af;font-size:13px;line-height:22px;">
                            Automated notification from your website.
                        </p>

                        <p style="margin:15px 0 0;color:#6b7280;font-size:12px;">
                            © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>`
        }, (error) => {
            console.log(error)
        })

    } catch (error) {
        let errorMessage;

        if (error.errors) {
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
async function getRecord(req, res) {
    try {
        let data = await Contactus.find().sort({ _id: -1 })
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
        let data = await Contactus.findOne({ _id: req.params._id })
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
        let data = await Contactus.findOne({ _id: req.params._id })
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
async function deleteRecord(req, res) {
    try {
        let data = await Contactus.findOne({ _id: req.params._id })
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
    creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord
}
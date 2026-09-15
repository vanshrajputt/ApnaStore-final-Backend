const { populate } = require("dotenv");
const Checkout = require("../models/checkout.model");
const mailer = require("../helper/mailer.helper")

const Razorpay = require("razorpay")

async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}
async function verifyOrder(req, res) {
    try {
        console.log("VERIFY BODY:", req.body);
        var check = await Checkout.findOne({ _id: req.body.checkid })

         console.log("RAZORPAY PAYMENT ID:", req.body.razorpay_payment_id);

        check.rppid = req.body.razorpay_payment_id
        check.paymentstatus = "Done"
        check.paymentMode = "Net Banking"
        
        await check.save()
         console.log("SAVED RPPID:", check.rppid);
        res.status(200).send({ result: "Done", message: "Payment SuccessFull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
async function creatRecord(req, res) {

    try {

        // ==============================
        // CREATE ORDER
        // ==============================

        let data = new Checkout(req.body);

        await data.save();


        // ==============================
        // GET POPULATED ORDER
        // ==============================

        let finalData = await Checkout.findOne({
            _id: data._id
        })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            });


        // ==============================
        // ORDER PRODUCTS HTML
        // ==============================

        const orderProducts = finalData.products.map(item => {

            const productName =
                item.product?.name || "-";

            const brandName =
                item.product?.brand?.name || "-";

            const size =
                item.size || "-";

            const color =
                item.color || "-";

            const quantity =
                Number(item.quantity) || 0;

            const price =
                Number(item.product?.finalPrice) || 0;

            const total =
                Number(item.total) || 0;


            return `
            
            <tr>

                <!-- PRODUCT -->

                <td style="
                    padding:14px 10px;
                    border-top:1px solid #e5e7eb;
                    color:#111827;
                    font-size:13px;
                    font-weight:600;
                    white-space:nowrap;">
                    
                    ${productName}

                </td>


                <!-- BRAND -->

                <td style="
                    padding:14px 10px;
                    border-top:1px solid #e5e7eb;
                    color:#374151;
                    font-size:13px;
                    white-space:nowrap;">

                    ${brandName}

                </td>


                <!-- SIZE -->

                <td style="
                    padding:14px 10px;
                    border-top:1px solid #e5e7eb;
                    color:#374151;
                    font-size:13px;
                    white-space:nowrap;">

                    ${size}

                </td>


                <!-- COLOR -->

                <td style="
                    padding:14px 10px;
                    border-top:1px solid #e5e7eb;
                    color:#374151;
                    font-size:13px;
                    white-space:nowrap;">

                    ${color}

                </td>


                <!-- QUANTITY -->

                <td align="center"
                    style="
                    padding:14px 8px;
                    border-top:1px solid #e5e7eb;
                    color:#374151;
                    font-size:13px;">

                    ${quantity}

                </td>


                <!-- PRICE -->

                <td align="right"
                    style="
                    padding:14px 8px;
                    border-top:1px solid #e5e7eb;
                    color:#374151;
                    font-size:13px;
                    white-space:nowrap;">

                    ₹${price}

                </td>


                <!-- TOTAL -->

                <td align="right"
                    style="
                    padding:14px 10px;
                    border-top:1px solid #e5e7eb;
                    color:#111827;
                    font-size:13px;
                    font-weight:700;
                    white-space:nowrap;">

                    ₹${total}

                </td>

            </tr>

            `;

        }).join("");


        // ==============================
        // SEND EMAIL
        // ==============================

        mailer.sendMail({

            from: process.env.MAIL_USERNAME,

            to: finalData.deliveryAddress?.email,

            subject:
                `Order Placed Successfully : Team ${process.env.SITE_NAME}`,

            html: `

<body style="
    margin:0;
    padding:0;
    background:#f3f6fa;
    font-family:Arial,Helvetica,sans-serif;
    color:#111827;">


<!-- OUTER TABLE -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        margin:0;
        padding:20px 10px;
        background:#f3f6fa;">

<tr>

<td align="center">


<!-- MAIN CONTAINER -->

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        max-width:700px;
        margin:0 auto;
        background:#ffffff;
        border-radius:18px;
        overflow:hidden;
        box-shadow:0 10px 35px rgba(0,0,0,0.08);">


<!-- ================================= -->
<!-- HEADER -->
<!-- ================================= -->

<tr>

<td style="
    background:linear-gradient(135deg,#0f172a,#2563eb);
    padding:40px 25px;
    text-align:center;">


<!-- LOGO -->

<div style="
    display:inline-block;
    width:70px;
    height:70px;
    line-height:70px;
    background:#ffffff;
    border-radius:50%;
    font-size:32px;">

    🛍️

</div>


<!-- SITE NAME -->

<h1 style="
    margin:18px 0 8px;
    color:#ffffff;
    font-size:32px;
    line-height:40px;
    font-weight:700;">

    ${process.env.SITE_NAME}

</h1>


<p style="
    margin:0;
    color:#dbeafe;
    font-size:15px;">

    Order Confirmation

</p>


</td>

</tr>



<!-- ================================= -->
<!-- SUCCESS MESSAGE -->
<!-- ================================= -->

<tr>

<td style="
    padding:35px 25px 25px;
    text-align:center;">


<div style="
    font-size:60px;
    line-height:70px;">

    🎉

</div>


<h2 style="
    margin:15px 0 10px;
    color:#111827;
    font-size:28px;
    line-height:36px;">

    Order Placed Successfully!

</h2>


<p style="
    margin:0;
    color:#4b5563;
    font-size:15px;
    line-height:27px;">

    Hi

    <strong>
        ${finalData.deliveryAddress?.name || "Customer"}
    </strong>,

    <br><br>

    Thank you for shopping with

    <strong>
        ${process.env.SITE_NAME}
    </strong>.

    <br>

    Your order has been successfully placed.

</p>


</td>

</tr>



<!-- ================================= -->
<!-- ORDER INFORMATION -->
<!-- ================================= -->

<tr>

<td style="
    padding:15px 25px;">


<table
    width="100%"
    cellpadding="14"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        background:#f8fafc;
        border:1px solid #e5e7eb;
        border-radius:14px;">


<tr>

<td colspan="2"
    style="
        color:#1e3a8a;
        font-size:18px;
        font-weight:bold;
        padding-bottom:15px;">

    📦 Order Information

</td>

</tr>


<!-- ORDER ID -->

<tr>

<td style="
    color:#6b7280;
    font-size:14px;">

    🆔 Order ID

</td>


<td align="right"
    style="
        color:#111827;
        font-weight:600;
        font-size:12px;
        word-break:break-all;">

    ${finalData._id}

</td>

</tr>


<!-- ORDER DATE -->

<tr>

<td style="
    color:#6b7280;
    font-size:14px;">

    📅 Order Date

</td>


<td align="right"
    style="
        color:#111827;
        font-size:13px;">

    ${new Date(finalData.createdAt).toLocaleString("en-IN")}

</td>

</tr>


<!-- PAYMENT MODE -->

<tr>

<td style="
    color:#6b7280;
    font-size:14px;">

    💳 Payment Mode

</td>


<td align="right"
    style="
        color:#111827;
        font-size:14px;
        font-weight:600;">

    ${finalData.paymentMode || "COD"}

</td>

</tr>


<!-- PAYMENT STATUS -->

<tr>

<td style="
    color:#6b7280;
    font-size:14px;">

    💰 Payment Status

</td>


<td align="right">

<span style="
    display:inline-block;
    background:#fef3c7;
    color:#92400e;
    padding:6px 13px;
    border-radius:20px;
    font-size:12px;
    font-weight:bold;">

    ${finalData.paymentStatus || "Pending"}

</span>

</td>

</tr>


</table>


</td>

</tr>



<!-- ================================= -->
<!-- PRODUCTS -->
<!-- ================================= -->

<tr>

<td style="
    padding:20px 15px;">


<h3 style="
    margin:0 0 15px;
    color:#111827;
    font-size:20px;
    line-height:28px;">

    🛒 Ordered Products

</h3>


<!-- HORIZONTAL SCROLL -->

<div style="
    width:100%;
    overflow-x:auto;
    -webkit-overflow-scrolling:touch;">


<table
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        min-width:650px;
        border:1px solid #e5e7eb;
        border-radius:12px;
        border-collapse:separate;
        overflow:hidden;
        background:#ffffff;">


<!-- TABLE HEADER -->

<tr style="
    background:#f8fafc;">


<th align="left"
    style="
        padding:13px 8px;
        color:#6b7280;
        font-size:11px;
        white-space:nowrap;">

    Product

</th>


<th align="left"
    style="
        padding:13px 8px;
        color:#6b7280;
        font-size:11px;
        white-space:nowrap;">

    Brand

</th>


<th align="left"
    style="
        padding:13px 8px;
        color:#6b7280;
        font-size:11px;
        white-space:nowrap;">

    Size

</th>


<th align="left"
    style="
        padding:13px 8px;
        color:#6b7280;
        font-size:11px;
        white-space:nowrap;">

    Color

</th>


<th align="center"
    style="
        padding:13px 8px;
        color:#6b7280;
        font-size:11px;
        white-space:nowrap;">

    Qty

</th>


<th align="right"
    style="
        padding:13px 8px;
        color:#6b7280;
        font-size:11px;
        white-space:nowrap;">

    Price

</th>


<th align="right"
    style="
        padding:13px 8px;
        color:#6b7280;
        font-size:11px;
        white-space:nowrap;">

    Total

</th>


</tr>


<!-- PRODUCTS -->

${orderProducts}


<!-- SUBTOTAL -->

<tr>

<td colspan="6"
    align="right"
    style="
        padding:13px;
        border-top:1px solid #e5e7eb;
        color:#6b7280;
        font-size:13px;">

    Subtotal

</td>


<td align="right"
    style="
        padding:13px;
        border-top:1px solid #e5e7eb;
        color:#111827;
        font-size:13px;
        font-weight:600;
        white-space:nowrap;">

    ₹${Number(finalData.subtotal) || 0}

</td>

</tr>



<!-- SHIPPING -->

<tr>

<td colspan="6"
    align="right"
    style="
        padding:13px;
        color:#6b7280;
        font-size:13px;">

    Shipping

</td>


<td align="right"
    style="
        padding:13px;
        color:#111827;
        font-size:13px;
        font-weight:600;
        white-space:nowrap;">

    ₹${Number(finalData.shipping) || 0}

</td>

</tr>



<!-- GRAND TOTAL -->

<tr style="
    background:#eff6ff;">


<td colspan="6"
    align="right"
    style="
        padding:16px;
        color:#1e3a8a;
        font-size:17px;
        font-weight:bold;">

    Grand Total

</td>


<td align="right"
    style="
        padding:16px;
        color:#2563eb;
        font-size:19px;
        font-weight:bold;
        white-space:nowrap;">

    ₹${Number(finalData.total) || 0}

</td>


</tr>


</table>


</div>


</td>

</tr>



<!-- ================================= -->
<!-- DELIVERY ADDRESS -->
<!-- ================================= -->

<tr>

<td style="
    padding:15px 25px;">


<table
    width="100%"
    cellpadding="18"
    cellspacing="0"
    border="0"
    style="
        width:100%;
        background:#f8fafc;
        border:1px solid #e5e7eb;
        border-radius:14px;">


<tr>

<td>


<h3 style="
    margin:0 0 12px;
    color:#1e3a8a;
    font-size:18px;">

    📍 Delivery Address

</h3>


<p style="
    margin:0;
    color:#374151;
    font-size:14px;
    line-height:24px;">

    <strong>
        ${finalData.deliveryAddress?.name || ""}
    </strong>

    <br>

    ${finalData.deliveryAddress?.address || ""}

    <br>

    ${finalData.deliveryAddress?.city || ""}

    ${finalData.deliveryAddress?.state || ""}

    <br>

    ${finalData.deliveryAddress?.pincode || ""}

    <br>

    📞 ${finalData.deliveryAddress?.mobile || ""}

</p>


</td>

</tr>


</table>


</td>

</tr>



<!-- ================================= -->
<!-- WHAT'S NEXT -->
<!-- ================================= -->

<tr>

<td style="
    padding:20px 25px 30px;">


<div style="
    background:#eff6ff;
    border-left:5px solid #2563eb;
    border-radius:10px;
    padding:20px;">


<h3 style="
    margin:0 0 8px;
    color:#1e3a8a;
    font-size:17px;">

    📦 What's Next?

</h3>


<p style="
    margin:0;
    color:#1e40af;
    font-size:14px;
    line-height:24px;">

    We are preparing your order for shipment.
    You will receive another notification once
    your order has been shipped.

</p>


</div>


</td>

</tr>



<!-- ================================= -->
<!-- CTA -->
<!-- ================================= -->

<tr>

<td style="
    padding:0 25px 35px;
    text-align:center;">


<a href="${process.env.SITE_URL}"
    style="
        display:inline-block;
        background:#2563eb;
        color:#ffffff;
        text-decoration:none;
        padding:14px 30px;
        border-radius:8px;
        font-size:15px;
        font-weight:bold;">

    🛒 Continue Shopping

</a>


</td>

</tr>



<!-- ================================= -->
<!-- FOOTER -->
<!-- ================================= -->

<tr>

<td style="
    background:#111827;
    padding:30px 20px;
    text-align:center;">


<h3 style="
    margin:0;
    color:#ffffff;
    font-size:19px;">

    ${process.env.SITE_NAME} 🛍️

</h3>


<p style="
    margin:10px 0;
    color:#9ca3af;
    font-size:13px;
    line-height:22px;">

    Thank you for shopping with
    ${process.env.SITE_NAME}.

    <br>

    We appreciate your business.

</p>


<a href="${process.env.SITE_URL}"
    style="
        color:#60a5fa;
        text-decoration:none;
        font-size:13px;
        font-weight:600;">

    Visit Our Website

</a>


<p style="
    margin:18px 0 0;
    color:#6b7280;
    font-size:11px;">

    © 2026 ${process.env.SITE_NAME}.
    All Rights Reserved.

</p>


</td>

</tr>



</table>

<!-- END MAIN CONTAINER -->


</td>

</tr>

</table>

<!-- END OUTER TABLE -->


</body>

</html>

`

        }, (error) => {

            if (error) {

                console.log(
                    "Order Confirmation Mail Error:",
                    error
                );

            } else {

                console.log(
                    "Order Confirmation Mail Sent Successfully"
                );

            }

        });


        // ===============================
// MAIL TO ADMIN - NEW ORDER
// ===============================

mailer.sendMail({
    from: process.env.MAIL_USERNAME,
    to: process.env.MAIL_USERNAME,

    subject: `🛒 New Order Received  || ${finalData.deliveryAddress?.name} | Order ID:- #${finalData._id}  | ${process.env.SITE_NAME}`,

    html: `
<table width="100%" cellpadding="0" cellspacing="0"
style="margin:0;padding:30px 15px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;">

<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0"
style="max-width:750px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08);">

<!-- HEADER -->

<tr>
<td style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:40px;text-align:center;">

<div style="
display:inline-block;
width:70px;
height:70px;
line-height:70px;
background:#ffffff;
border-radius:50%;
font-size:32px;">
🛍️
</div>

<h1 style="
margin:18px 0 8px;
color:#ffffff;
font-size:32px;">
${process.env.SITE_NAME}
</h1>

<p style="
margin:0;
color:#dbeafe;
font-size:15px;">
New Order Notification
</p>

</td>
</tr>


<!-- ALERT -->

<tr>
<td style="padding:40px 35px 20px;text-align:center;">

<div style="font-size:60px;">
🎉
</div>

<h2 style="
margin:15px 0 10px;
color:#111827;
font-size:28px;">
New Order Received!
</h2>

<p style="
margin:0;
color:#6b7280;
font-size:15px;
line-height:26px;">

A new order has been successfully placed on
<strong>${process.env.SITE_NAME}</strong>.

</p>

</td>
</tr>


<!-- ORDER INFORMATION -->

<tr>
<td style="padding:20px 35px;">

<table width="100%" cellpadding="15" cellspacing="0"
style="
background:#f8fafc;
border:1px solid #e5e7eb;
border-radius:14px;">

<tr>
<td colspan="2"
style="
color:#1e3a8a;
font-size:19px;
font-weight:bold;
padding-bottom:18px;">

📦 Order Information

</td>
</tr>

<tr>
<td style="color:#6b7280;">
🆔 Order ID
</td>

<td align="right"
style="color:#111827;font-weight:600;">
${finalData._id}
</td>
</tr>

<tr>
<td style="color:#6b7280;">
📅 Order Date
</td>

<td align="right"
style="color:#111827;">
${new Date(finalData.createdAt).toLocaleString("en-IN")}
</td>
</tr>

<tr>
<td style="color:#6b7280;">
💳 Payment Mode
</td>

<td align="right"
style="color:#111827;font-weight:600;">
${finalData.paymentMode}
</td>
</tr>

<tr>
<td style="color:#6b7280;">
💰 Payment Status
</td>

<td align="right">

<span style="
display:inline-block;
background:#fef3c7;
color:#92400e;
padding:7px 15px;
border-radius:20px;
font-size:13px;
font-weight:bold;">

${finalData.paymentStatus}

</span>

</td>
</tr>

</table>

</td>
</tr>


<!-- CUSTOMER -->

<tr>
<td style="padding:20px 35px;">

<h3 style="
margin:0 0 15px;
color:#111827;
font-size:20px;">

👤 Customer Information

</h3>

<table width="100%" cellpadding="12" cellspacing="0"
style="
background:#ffffff;
border:1px solid #e5e7eb;
border-radius:12px;">

<tr>

<td style="color:#6b7280;">
Name
</td>

<td align="right"
style="color:#111827;font-weight:600;">

${finalData.deliveryAddress?.name || "-"}

</td>

</tr>

<tr>

<td style="color:#6b7280;">
Email
</td>

<td align="right"
style="color:#111827;">

${finalData.deliveryAddress?.email || "-"}

</td>

</tr>

<tr>

<td style="color:#6b7280;">
Mobile
</td>

<td align="right"
style="color:#111827;">

${finalData.deliveryAddress?.mobile || "-"}

</td>

</tr>

</table>

</td>
</tr>


<!-- PRODUCTS -->

<tr>
<td style="padding:20px 35px;">

<h3 style="
margin:0 0 18px;
color:#111827;
font-size:20px;">

🛒 Ordered Products

</h3>

<table width="100%" cellpadding="0" cellspacing="0"
style="
border:1px solid #e5e7eb;
border-radius:12px;
overflow:hidden;
border-collapse:separate;">

<tr style="background:#f8fafc;">

<th align="left"
style="padding:14px 10px;color:#6b7280;font-size:12px;">
Product
</th>

<th align="left"
style="padding:14px 10px;color:#6b7280;font-size:12px;">
Brand
</th>

<th align="left"
style="padding:14px 10px;color:#6b7280;font-size:12px;">
Size
</th>

<th align="left"
style="padding:14px 10px;color:#6b7280;font-size:12px;">
Color
</th>

<th align="center"
style="padding:14px 5px;color:#6b7280;font-size:12px;">
Qty
</th>

<th align="right"
style="padding:14px 5px;color:#6b7280;font-size:12px;">
Price
</th>

<th align="right"
style="padding:14px 10px;color:#6b7280;font-size:12px;">
Total
</th>

</tr>

${orderProducts}

</table>

</td>
</tr>


<!-- TOTAL -->

<tr>
<td style="padding:10px 35px 30px;">

<table width="100%" cellpadding="12" cellspacing="0">

<tr>

<td align="right"
style="color:#6b7280;">
Subtotal
</td>

<td align="right"
style="color:#111827;font-weight:600;">
₹${finalData.subtotal}
</td>

</tr>

<tr>

<td align="right"
style="color:#6b7280;">
Shipping
</td>

<td align="right"
style="color:#111827;font-weight:600;">
₹${finalData.shipping}
</td>

</tr>

<tr style="background:#eff6ff;">

<td align="right"
style="
color:#1e3a8a;
font-size:18px;
font-weight:bold;
padding:18px;">

Grand Total

</td>

<td align="right"
style="
color:#2563eb;
font-size:20px;
font-weight:bold;
padding:18px;">

₹${finalData.total}

</td>

</tr>

</table>

</td>
</tr>


<!-- DELIVERY ADDRESS -->

<tr>
<td style="padding:10px 35px 30px;">

<table width="100%" cellpadding="18" cellspacing="0"
style="
background:#f8fafc;
border:1px solid #e5e7eb;
border-radius:14px;">

<tr>

<td>

<h3 style="
margin:0 0 15px;
color:#1e3a8a;
font-size:19px;">

📍 Delivery Address

</h3>

<p style="
margin:0;
color:#374151;
font-size:14px;
line-height:25px;">

<strong>
${finalData.deliveryAddress?.name || ""}
</strong>

<br>

${finalData.deliveryAddress?.address || ""}

<br>

${finalData.deliveryAddress?.city || ""}
${finalData.deliveryAddress?.state || ""}

<br>

${finalData.deliveryAddress?.pincode || ""}

<br>

📞 ${finalData.deliveryAddress?.mobile || ""}

</p>

</td>

</tr>

</table>

</td>
</tr>


<!-- ADMIN ACTION -->

<tr>
<td style="padding:10px 35px 40px;text-align:center;">

<p style="
margin:0 0 20px;
color:#6b7280;
font-size:14px;">

Please login to the admin panel to process this order.

</p>

<a href="${process.env.SITE_URL}"
style="
display:inline-block;
background:#2563eb;
color:#ffffff;
text-decoration:none;
padding:15px 35px;
border-radius:8px;
font-size:16px;
font-weight:bold;">

⚙️ Manage Order

</a>

</td>
</tr>


<!-- FOOTER -->

<tr>

<td style="
background:#111827;
padding:30px;
text-align:center;">

<h3 style="
margin:0;
color:#ffffff;
font-size:19px;">

${process.env.SITE_NAME} 🛍️

</h3>

<p style="
margin:12px 0 0;
color:#9ca3af;
font-size:13px;
line-height:22px;">

This is an automated notification.
A new customer order has been received.

</p>

<p style="
margin:15px 0 0;
color:#6b7280;
font-size:12px;">

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
        console.log("Admin Order Notification Mail Error:", error);
    } else {
        console.log("Admin Order Notification Mail Sent Successfully");
    }

});


        // ==============================
        // RESPONSE
        // ==============================

        res.send({

            result: "Done",

            data: finalData

        });


    } catch (error) {

        console.log(error);


        let errorMessage = {};


        if (error.keyValue) {

            errorMessage = Object.fromEntries(

                Object.keys(error.keyValue).map(key => [

                    key,

                    `Checkout With this ${key} Already Exist`

                ])

            );

        }

        else if (error.errors) {

            errorMessage = Object.fromEntries(

                Object.keys(error.errors).map(key => [

                    key,

                    error.errors[key].message

                ])

            );

        }


        if (Object.keys(errorMessage).length !== 0) {

            res.status(400).send({

                result: "Fail",

                reason: errorMessage

            });

        }

        else {

            res.status(500).send({

                result: "Fail",

                reason: "Internal Server Error"

            });

        }

    }

}

async function getRecord(req, res) {
    try {
        let data = await Checkout.find().sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic ",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
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
async function getUserRecord(req, res) {
    try {
        let data = await Checkout.find({user:req.params.user}).sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic ",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
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
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic ",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
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
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic ",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Data Available"
            })
        }
        data.paymentMode = req.body.paymentMode ?? data.paymentMode;
        data.paymentstatus = req.body.paymentstatus ?? data.paymentstatus;
        data.orderStatus = req.body.orderStatus ?? data.orderStatus
        data.rppid = req.body.rppid ?? data.rppid


        await data.save()
        res.status(200).send({
            result: "Done",
            data: data
        })
        // ===============================
// ORDER STATUS UPDATE MAIL
// ===============================

mailer.sendMail({
    from: process.env.MAIL_USERNAME,
    to: data.deliveryAddress?.email,

    subject: `📦 Order Status Updated | ${process.env.SITE_NAME}`,

    html: `
<table width="100%" cellpadding="0" cellspacing="0"
style="margin:0;padding:30px 15px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;">

<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0"
style="max-width:700px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08);">

<!-- HEADER -->

<tr>
<td style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:40px;text-align:center;">

<div style="
display:inline-block;
width:70px;
height:70px;
line-height:70px;
background:#ffffff;
border-radius:50%;
font-size:32px;">
📦
</div>

<h1 style="
margin:18px 0 8px;
color:#ffffff;
font-size:32px;">
${process.env.SITE_NAME}
</h1>

<p style="
margin:0;
color:#dbeafe;
font-size:15px;">
Order Status Update
</p>

</td>
</tr>


<!-- MAIN MESSAGE -->

<tr>
<td style="padding:45px 35px 25px;text-align:center;">

<div style="font-size:60px;">
🔔
</div>

<h2 style="
margin:18px 0 12px;
color:#111827;
font-size:28px;">
Your Order Status Has Been Updated
</h2>

<p style="
margin:0;
color:#4b5563;
font-size:16px;
line-height:28px;">

Hello <strong>${data.deliveryAddress?.name || "Customer"}</strong>,

<br><br>

Your order status has been successfully updated.
Here are your latest order details.

</p>

</td>
</tr>


<!-- ORDER DETAILS -->

<tr>
<td style="padding:20px 35px;">

<table width="100%" cellpadding="16" cellspacing="0"
style="
background:#f8fafc;
border:1px solid #e5e7eb;
border-radius:14px;">

<tr>

<td colspan="2"
style="
color:#1e3a8a;
font-size:19px;
font-weight:bold;
padding-bottom:20px;">

📋 Order Details

</td>

</tr>


<tr>

<td style="color:#6b7280;">
🆔 Order ID
</td>

<td align="right"
style="color:#111827;font-weight:600;">

${data._id}

</td>

</tr>


<tr>

<td style="color:#6b7280;">
📅 Order Date
</td>

<td align="right"
style="color:#111827;">

${new Date(data.updatedAt).toLocaleString("en-IN")}

</td>

</tr>


<tr>

<td style="color:#6b7280;">
📦 Order Status
</td>

<td align="right">

<span style="
display:inline-block;
background:#dbeafe;
color:#1d4ed8;
padding:8px 16px;
border-radius:20px;
font-size:13px;
font-weight:bold;">

${data.orderStatus}

</span>

</td>

</tr>


<tr>

<td style="color:#6b7280;">
💳 Payment Mode
</td>

<td align="right"
style="color:#111827;font-weight:600;">

${data.paymentMode}

</td>

</tr>


<tr>

<td style="color:#6b7280;">
💰 Payment Status
</td>

<td align="right">

<span style="
display:inline-block;
background:#fef3c7;
color:#92400e;
padding:8px 16px;
border-radius:20px;
font-size:13px;
font-weight:bold;">

${data.paymentstatus}

</span>

</td>

</tr>


<tr>

<td style="color:#6b7280;">
💵 Order Total
</td>

<td align="right"
style="
color:#2563eb;
font-size:18px;
font-weight:bold;">

₹${data.total}

</td>

</tr>

</table>

</td>
</tr>


<!-- STATUS MESSAGE -->

<tr>
<td style="padding:20px 35px 30px;">

<div style="
background:#eff6ff;
border-left:5px solid #2563eb;
border-radius:10px;
padding:22px;">

<h3 style="
margin:0 0 10px;
color:#1e3a8a;
font-size:18px;">

📦 What's Happening With Your Order?

</h3>

<p style="
margin:0;
color:#1e40af;
font-size:14px;
line-height:25px;">

Your order is currently marked as
<strong>${data.orderStatus}</strong>.

We will keep you updated as your order moves through the delivery process.

</p>

</div>

</td>
</tr>


<!-- DELIVERY ADDRESS -->

<tr>
<td style="padding:0 35px 30px;">

<table width="100%" cellpadding="18" cellspacing="0"
style="
background:#f8fafc;
border:1px solid #e5e7eb;
border-radius:14px;">

<tr>
<td>

<h3 style="
margin:0 0 15px;
color:#1e3a8a;
font-size:19px;">

📍 Delivery Address

</h3>

<p style="
margin:0;
color:#374151;
font-size:14px;
line-height:25px;">

<strong>
${data.deliveryAddress?.name || ""}
</strong>

<br>

${data.deliveryAddress?.address || ""}

<br>

${data.deliveryAddress?.city || ""}
${data.deliveryAddress?.state || ""}

<br>

${data.deliveryAddress?.pincode || ""}

<br>

📞 ${data.deliveryAddress?.mobile || ""}

</p>

</td>
</tr>

</table>

</td>
</tr>


<!-- CTA -->

<tr>
<td style="
padding:5px 35px 40px;
text-align:center;">

<a href="${process.env.SITE_URL}"
style="
display:inline-block;
background:#2563eb;
color:#ffffff;
text-decoration:none;
padding:15px 38px;
border-radius:8px;
font-size:16px;
font-weight:bold;">

🛒 Visit ${process.env.SITE_NAME}

</a>

</td>
</tr>


<!-- FOOTER -->

<tr>

<td style="
background:#111827;
padding:30px;
text-align:center;">

<h3 style="
margin:0;
color:#ffffff;
font-size:19px;">

${process.env.SITE_NAME} 🛍️

</h3>

<p style="
margin:12px 0;
color:#9ca3af;
font-size:13px;
line-height:22px;">

Thank you for shopping with
${process.env.SITE_NAME}.

<br>

We appreciate your trust and support.

</p>

<a href="${process.env.SITE_URL}"
style="
color:#60a5fa;
text-decoration:none;
font-size:14px;
font-weight:600;">

Visit Our Website

</a>

<p style="
margin:18px 0 0;
color:#6b7280;
font-size:12px;">

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
        console.log("Order Status Mail Error:", error);
    } else {
        console.log("Order Status Mail Sent Successfully");
    }

});
    } catch (error) {

        let errorMessage = {};
        if (error.errors) {
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [
                key, error.errors[key].message
            ]))
        } if (Object.values(errorMessage).length !== 0) {
           return res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })

        } else
           return res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })


    }

}
async function deleteRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
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
    creatRecord, getRecord, getSingleRecord, updateRecord, deleteRecord,getUserRecord,verifyOrder,order
}



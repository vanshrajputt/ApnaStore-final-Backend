const { error } = require("console");
const Product = require("../models/product.model")
const Newsletter = require("../models/newsletter.model")
const mailer = require("../helper/mailer.helper")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Product(req.body);
        //  uploade files
        if (req.files) {
            data.pic = req.files.map(file => file.path)
        }
        await data.save();
        let finalData = await Product.findById(data._id)
            .populate("maincategory", "name")
            .populate("subcategory", "name")
            .populate("brand", "name")

        res.send({
            result: "Done",
            data: finalData
        })
        let newsletters = await Newsletter.find({ status: true })
        newsletters.forEach(subscriber => {
            mailer.sendMail({
                from: process.env.MAIL_USERNAME,
                to: subscriber.email,
                subject: `🛍️ New Products Just Arrived - ${process.env.SITE_NAME}`,

                html: `
<table width="100%" cellpadding="0" cellspacing="0"
    style="margin:0;padding:30px 15px;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;">

    <tr>
        <td align="center">

            <table width="100%" cellpadding="0" cellspacing="0"
                style="max-width:700px;background:#ffffff;border-radius:18px;overflow:hidden;">

                <!-- HEADER -->
                <tr>
                    <td style="
                        background:linear-gradient(135deg,#0f172a,#2563eb);
                        padding:45px 30px;
                        text-align:center;">

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
                            New Products Are Here!
                        </p>

                    </td>
                </tr>


                <!-- MAIN CONTENT -->
                <tr>
                    <td style="
                        padding:45px 40px 25px;
                        text-align:center;">

                        <div style="font-size:55px;">
                            🎉
                        </div>

                        <h2 style="
                            margin:18px 0 12px;
                            color:#111827;
                            font-size:28px;">
                            Something New Just Dropped!
                        </h2>
                          <tr>

                    <td style="
                        text-align:center;">

                       <h2
                           style="
                               display:inline-block;
                               background:#2563eb;
                               color:#ffffff;
                               text-decoration:none;
                               padding:16px 42px;
                               border-radius:8px;
                               font-size:17px;
                               font-weight:bold;">

                            ${finalData.name}

                        </h2>

                    </td>
                   

                </tr>

                        <p style="
                            margin:0;
                            color:#4b5563;
                            font-size:16px;
                            line-height:28px;">

                            Hi <strong>${subscriber.name || "there"}</strong>,

                            <br><br>

                            We've just added exciting new products to
                            <strong>${process.env.SITE_NAME}</strong>.

                            <br>

                            Check out our latest collection and grab your
                            favourite product before it's gone!

                        </p>

                    </td>
                </tr>


               <!-- PRODUCT DETAILS -->
<tr>
    <td style="padding:20px 40px;">

        <table width="100%" cellpadding="0" cellspacing="0"
            style="
                border:1px solid #e5e7eb;
                border-radius:14px;
                overflow:hidden;
                background:#ffffff;">

            <tr>
                <td style="
                    background:#f8fafc;
                    padding:20px;
                    text-align:center;
                    color:#1e3a8a;
                    font-size:20px;
                    font-weight:bold;">

                    🔥 New Arrival

                </td> 
            </tr>
            <h2> ${finalData.name} </h2>

            <!-- PRODUCT IMAGE -->
            <tr>
                <td align="center" style="padding:25px 25px 10px;">

                    <img 
                        src="${process.env.SITE_URL}/${finalData.pic?.[0] || ""}"
                        alt="${finalData.name}"
                        width="250"
                        style="
                            display:block;
                            width:250px;
                            max-width:100%;
                            height:250px;
                            object-fit:contain;
                            border-radius:12px;
                        "
                    >

                </td>
            </tr>

           <!-- PRODUCT INFO -->
<tr>
    <td style="padding:25px;">

        <table width="100%" cellpadding="0" cellspacing="0">

            <!-- PRODUCT NAME -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Product Name
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#111827;
                    font-size:16px;
                    font-weight:bold;">
                    ${finalData.name || "-"}
                </td>
            </tr>


            <!-- BRAND -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Brand
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#111827;
                    font-size:16px;
                    font-weight:bold;">
                    ${finalData.brand?.name || "-"}
                </td>
            </tr>


            <!-- MAIN CATEGORY -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Category
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#111827;
                    font-size:15px;
                    font-weight:600;">
                    ${finalData.maincategory?.name || "-"}
                </td>
            </tr>


            <!-- SUB CATEGORY -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Sub Category
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#111827;
                    font-size:15px;
                    font-weight:600;">
                    ${finalData.subcategory?.name || "-"}
                </td>
            </tr>


            <!-- DESCRIPTION -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;
                    vertical-align:top;">
                    Description
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#374151;
                    font-size:14px;
                    line-height:22px;">
                    ${finalData.description || "-"}
                </td>
            </tr>


            <!-- BASE PRICE -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Base Price
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:15px;
                    text-decoration:line-through;">
                    ₹${finalData.basePrice || 0}
                </td>
            </tr>


            <!-- DISCOUNT -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Discount
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#16a34a;
                    font-size:15px;
                    font-weight:bold;">
                    ${finalData.discount || 0}%
                </td>
            </tr>


            <!-- FINAL PRICE -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Final Price
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#2563eb;
                    font-size:22px;
                    font-weight:bold;">
                    ₹${finalData.finalPrice || 0}
                </td>
            </tr>


            <!-- COLOR -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Color
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#111827;
                    font-size:15px;
                    font-weight:600;">
                    ${finalData.color || "-"}
                </td>
            </tr>


            <!-- SIZE -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Size
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#111827;
                    font-size:15px;
                    font-weight:600;">
                    ${Array.isArray(finalData.size)
                        ? finalData.size.join(", ")
                        : finalData.size || "-"}
                </td>
            </tr>


            <!-- STOCK QUANTITY -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Available Stock
                </td>

                <td align="right" style="
                    padding:10px 0;
                    color:#111827;
                    font-size:15px;
                    font-weight:600;">
                    ${finalData.stockQuantity || 0}
                </td>
            </tr>


            <!-- STOCK STATUS -->
            <tr>
                <td style="
                    padding:10px 0;
                    color:#6b7280;
                    font-size:14px;">
                    Stock Status
                </td>

                <td align="right">

                    <span style="
                        display:inline-block;
                        background:${finalData.stock === "In Stock" ? "#dcfce7" : "#fee2e2"};
                        color:${finalData.stock === "In Stock" ? "#166534" : "#991b1b"};
                        padding:7px 14px;
                        border-radius:20px;
                        font-size:13px;
                        font-weight:bold;">
                        ${finalData.stock || "Available"}
                    </span>

                </td>
            </tr>

        </table>

    </td>
</tr>

                <!-- CTA -->
                <tr>

                    <td style="
                        padding:30px 40px 45px;
                        text-align:center;">

                        <a href="${process.env.SITE_URL}/product/${finalData._id}"
                           style="
                               display:inline-block;
                               background:#2563eb;
                               color:#ffffff;
                               text-decoration:none;
                               padding:16px 42px;
                               border-radius:8px;
                               font-size:17px;
                               font-weight:bold;">

                            🛒 Shop & Checkout Now

                        </a>

                    </td>
                   

                </tr>


                <!-- FOOTER -->
                <tr>

                    <td style="
                        background:#111827;
                        padding:35px;
                        text-align:center;">

                        <h3 style="
                            margin:0;
                            color:#ffffff;
                            font-size:20px;">

                            ${process.env.SITE_NAME} 🛍️

                        </h3>

                        <p style="
                            margin:12px 0;
                            color:#9ca3af;
                            font-size:13px;
                            line-height:23px;">

                            Thank you for being a part of our community.

                            <br>

                            Stay tuned for more exciting products and offers.

                        </p>

                        <a href="${process.env.SITE_URL}"
                           style="
                               color:#60a5fa;
                               text-decoration:none;
                               font-size:14px;
                               font-weight:600;">

                            Visit Our Website

                        </a>
                        <br> <br>

           <a href="${process.env.SITE_URL}/unsubscribe/${subscriber._id}"
           style="
         color:#60a5fa;
         text-decoration:none;
         font-weight:600;
       font-size:12px;">
    Unsubscribe from these emails
</a>
                        <p style="
                            margin:20px 0 0;
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
                    console.log("Product Send  Confirmation Mail Error:", error);
                } else {
                    console.log(" Latest Product Confirmation Mail Sent Successfully");
                }

            });
        });


    } catch (error) {
        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path)
                } catch (error) { }
            })
        }
        let errorMessage = {};
        if (error.errors) {
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [
                key, error.errors[key].message
            ]))
        }
        if (Object.values(errorMessage).length !== 0) {
            return res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })

        } else {
            return res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })
        }

    }

}

async function getRecord(req, res) {
    try {
        let data = await Product.find().sort({ _id: -1 })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.status(200).send({
            result: "Done",
            data: data
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
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "No Such As Data"
            })
        }

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal server Error"
        })

    }

}
async function updateRecord(req, res) {

    try {
        let data = await Product.findById(req.params._id)
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Such Data"
            })
        }
        if (
            (!req.body.oldPics || req.body.oldPics.length === 0) &&
            (!req.files || req.files.length === 0)
        ) {
            return res.status(404).send({
                result: "Fail",
                reason: "Please Uploade Atleast One Image"
            })
        }

        // update Fields
        console.log(req.body)
        data.name = req.body.name ?? data.name;
        data.maincategory = req.body.maincategory ?? data.maincategory;
        data.subcategory = req.body.subcategory ?? data.subcategory;
        data.brand = req.body.brand ?? data.brand;
        data.color = req.body.color ?? data.color;
        data.size = req.body.size ?? data.size;
        data.basePrice = req.body.basePrice ?? data.basePrice;
        data.discount = req.body.discount ?? data.discount;
        data.finalPrice = req.body.finalPrice ?? data.finalPrice;
        data.description = req.body.description ?? data.description;
        data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
        data.stock = req.body.stock ?? data.stock;
        data.status = req.body.status ?? data.status;


        // delete OldImages
        if (req.body.oldPics) {
            data.pic.forEach((pic) => {
                if (!req.body.oldPics.includes(pic)) {
                    try {
                        fs.unlinkSync(pic)
                    } catch (error) { }
                }
            })
            data.pic = req.body.oldPics;
        }


        // add new image

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                data.pic.push(file.path)
            })
        }
        await data.save();

        let finalData = await Product.findById(data._id)
            .populate("maincategory", "name")
            .populate("subcategory", "name")
            .populate("brand", "name")
        return res.status(200).send({
            result: "Done",
            data: finalData
        })
    } catch (error) {

        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path)

                } catch (error) {

                }
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

async function deleteRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.pic?.forEach(x => {
                try {
                    fs.unlinkSync(x)

                } catch (error) { }
            })

            await data.deleteOne()
        }
        res.send({
            result: "Done"
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal server Error"
        })

    }

}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
}


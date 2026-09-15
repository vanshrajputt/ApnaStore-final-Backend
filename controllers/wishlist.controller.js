const { populate } = require("dotenv");
const Wishlist = require("../models/wishlist.model");
const { options } = require("../routes/faq.route");
async function creatRecord(req, res) {
    try {
        let data = new Wishlist(req.body)
        await data.save();

        let finalData = await Wishlist.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
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
            result: " done",
            data: finalData
        })
    } catch (error) {
        let errorMessage;
        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, `Wishlist With this ${key} Already Exist`
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
async function getRecord(req, res) {
    try {
        let data = await Wishlist.find({user:req.params.user}).sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name brand finalPrice stockQuantity pic color size ",
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
        let data = await Wishlist.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
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
        let data = await Wishlist.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
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
        await data.save()
        res.status(200).send({
            result: "Done",
            data: data
        })
    } catch (error) {

        let errorMessage = {};
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
async function deleteRecord(req, res) {
    try {
        let data = await Wishlist.findOne({ _id: req.params._id })
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
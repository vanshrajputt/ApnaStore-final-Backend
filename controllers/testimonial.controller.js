const { populate } = require("dotenv");
const Testimonial = require("../models/testimonial.model");

async function creatRecord(req, res) {
    try {
        let data = new Testimonial(req.body)
        await data.save();

        let finalData = await Testimonial.findOne({ _id: data._id })
            .populate("user", ["name"])
            .populate("product", ["name"])
        res.send({
            result: " done",
            data: finalData
        })
    } catch (error) {
        let errorMessage;
        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, `Testimonial With this ${key} Already Exist`
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
        let data = await Testimonial.find().sort({ _id: -1 })

            .populate("user", ["name"])
            .populate("product", ["name"])
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
        let data = await Testimonial.findOne({ _id: req.params._id })
            .populate("user", ["name"])
            .populate("product", ["name"])
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
        let data = await Testimonial.findOne({ _id: req.params._id })
            .populate("user", ["name"])
            .populate("product", ["name"])
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Data Available"
            })
        }
        data.message = req.body.message ?? data.message;
        data.star = req.body.star ?? data.star


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
        let data = await Testimonial.findOne({ _id: req.params._id })
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
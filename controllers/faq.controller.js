const Faq = require("../models/faq.model")
async function creatRecord(req, res) {
    try {
        let data = new Faq(req.body)
        await data.save();
        res.send({
            result: " done",
            data: data
        })
    } catch (error) {
        let errorMessage;
        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, "Faq With this Question Already Exist"
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
        let data = await Faq.find().sort({ _id: -1 })
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
        let data = await Faq.findOne({ _id: req.params._id })
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
        let data = await Faq.findOne({ _id: req.params._id })
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Data Available"
            })
        }
        data.question = req.body.question ?? data.question;
        data.answer = req.body.answer ?? data.answer;
        data.status = req.body.status ?? data.status


        await data.save()
        res.status(200).send({
            result: "Done",
            data: data
        })
    } catch (error) {

        let errorMessage;
        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, "Faq With this Question Already Exist"
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
        let data = await Faq.findOne({ _id: req.params._id })
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
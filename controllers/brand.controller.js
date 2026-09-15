const Brand = require("../models/brand.model")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Brand(req.body)
        if (req.file)
            data.pic = req.file.path
        await data.save()
        res.send({
            result: "Done",
            data: data

        })


    } catch (error) {
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path)

            } catch (error) {

            }
        }
        let errorMessage;
        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, "Brand This Name Already Exist"
            ]))
        }
        else {
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [
                key, error.errors[key].message
            ]))
        }
        if (Object.values(errorMessage).length !== 0) {
            res.status(404).send({
                result: "Fail",
                reason: errorMessage
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
        let data = await Brand.find().sort({ _id: -1 })
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
        let data = await Brand.findOne({ _id: req.params._id })
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
        let data = await Brand.findOne({ _id: req.params._id })
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Such Data"

            })
        }

        data.name = req.body.name ?? data.name;
        data.status = req.body.status ?? data.status;

        // Agr image upload kr rhe hai to old image delete kro,

        if (req.file) {
            if (data.pic) {
                try {
                    fs.unlinkSync(data.pic)

                } catch (error) { }

            }
            data.pic = req.file.path;

        }
        await data.save();
        res.status(200).send({
            result: "Done",
            data: data
        })

    } catch (error) {
        if (req.file) {
            try {

                fs.unlinkSync(req.file.path)
            } catch (error) {

            }
        }
        let errorMessage;

        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, "Brand With this Name Already Exist"
            ]))
        }
        else {
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [
                key, error.errors[key].message
            ]))
        }
        if (Object.values(errorMessage).length !== 0) {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
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
        let data = await Brand.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) {

            }
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


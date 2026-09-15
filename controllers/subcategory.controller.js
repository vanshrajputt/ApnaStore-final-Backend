const Subcategory = require("../models/subcategory.model")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Subcategory(req.body)
        if (req.file)
            data.pic = req.file.path
        await data.save()
        res.send({
            result: "Done",
            data: data
        })


    } catch (error) {
        // console.log(error.keyValue)
        // console.log(error.errors)
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path)

            } catch (error) {

            }
        }

        let errorMessage;
        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, "Subcategory With This name Already Exist"]))

        } else {
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

async function getRecord(req, res) {
    try {
        let data = await Subcategory.find().sort({ _id: -1 })
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
async function getSingalRecord(req, res) {

    try {
        let data = await Subcategory.findOne({ _id: req.params._id })
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
        let data = await Subcategory.findOne({ _id: req.params._id })
        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "No Such Data Exist"
            })
        }

        // update name Ans status
        data.name = req.body.name ?? data.name;
        data.status = req.body.status ?? data.status;

        //  agr image upload kr rhe hai to old image delete kro
        if (req.file) {
            if (data.pic) {
                try {
                    fs.unlinkSync(data.pic)

                } catch (error) { }
            }
            // Add new pic path

            data.pic = req.file.path;
        }
        await data.save();
        res.send({
            result: "Done",
            data: data
        })

    } catch (error) {

        if (req.file) {
            try {
                fs.unlinkSync(req.file.path)

            } catch (error) { }
        }

        let errorMessage;
        if (error.keyValue) {
            errorMessage = Object.fromEntries(Object.keys(error.keyValue).map(key => [
                key, "Subcategory With this Name Already Exist"
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
        let data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)

            } catch (error) { }
            await data.deleteOne()
        } res.send({
            result: "Done"
        })

    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "No Such Data"
        })

    }

}

module.exports = {
    createRecord,
    getRecord,
    getSingalRecord,
    updateRecord,
    deleteRecord
}
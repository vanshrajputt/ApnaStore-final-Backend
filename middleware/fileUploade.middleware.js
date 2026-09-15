const multer = require("multer")

function generateUploader(folder) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/uploads/${folder}`)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
            // cb(null, new Date().getMilliseconds() + file.originalname)

        }
    })

    return multer({ storage: storage })


}
module.exports = {
    maincategoryUploader: generateUploader("maincategory"),
    subcategoryUploader: generateUploader("subcategory"),
    brandUploader: generateUploader("brand"),
    productUploader: generateUploader("product")
}
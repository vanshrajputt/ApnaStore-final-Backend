const mongoose = require ("mongoose")

const FeatureSchema = new mongoose.Schema({

    name:{
        type : String,
        required:[true , "Feature Name is Mendatory"],
        unique : true
    },
     shortDescription:{
        type : String,
        required:[true , "Feature Short Description is Mendatory"],
        unique : true
    },
     icon:{
        type : String,
        required:[true , "Feature Icon is Mendatory"],
        unique : true
    },
     status:{
        type : Boolean,
         default : true
    },
    
})


const Feature = new mongoose.model("Feature",FeatureSchema)
module.exports = Feature
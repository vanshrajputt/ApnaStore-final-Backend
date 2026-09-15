require("mongoose").connect(process.env.DB_KEY)
.then(()=>{
    console.log("DataBase Connected")
})
.catch()
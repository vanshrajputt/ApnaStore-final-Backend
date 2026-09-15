// const express = require("express");
// const cors = require("cors");
// const path = require("path")

// require("dotenv").config();
// require("./config/db-connect");

// const Router = require("./routes/index.routes");

// const app = express();

// app.use(express.json());

// // CORS MUST COME BEFORE ROUTES
// // app.use(
// //     cors({
// //         origin: function (origin, callback) {

// //             if (!origin || allowedOrigins.includes(origin)) {
// //                 callback(null, true);
// //             } else {
// //                 callback(
// //                     new Error(
// //                         `CORS Error: You Are Not Authorized to Access This API - ${origin}`
// //                     )
// //                 );
// //             }
// //         },
// //         credentials: true
// //     })
// // );
// app.use(cors())

// // Routes
// app.use("/api", Router);

// // Public files
// app.use("/public", express.static("./public"));

// app.use(express.static(path.join(__dirname, 'dist')))

// app.use((req, res) => {
//     express.static(path.join(__dirname, 'dist'))
// })
// const port = process.env.PORT || 8000;

// app.listen(port, () => {
//     console.log(`Server run at http://localhost:${port}`);
// });

const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
require("./config/db-connect");

const Router = require("./routes/index.routes");

const app = express();

app.use(express.json());

app.use(cors());

// Public files
app.use("/public", express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api", Router);

// Dist
app.use(express.static(path.join(__dirname, "dist")));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server run at http://localhost:${port}`);
});
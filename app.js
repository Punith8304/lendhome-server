import express from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
import db from "./src/config/databaseConfig.js"
import session from "express-session"
import { connectDatabase } from "./src/config/databaseConfig.js"
import { upload } from "./src/middlewares/multerMiddleware.js"
import uploadHouseDetails from "./src/routes/uploadHouseDetails.js"
import propertyDetails from "./src/routes/propertyDetails.js"
import userDetails from "./src/routes/userDetails.js"
import pgSessionStore from "connect-pg-simple"
const app = express()
connectDatabase() //Establishing database connection
app.use(express.json()) //parse incoming JSON requests
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
// const postgresStore = pgSessionStore(session)
//Allow all origins by default
app.set('trust proxy', 1)
app.use(session({
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 60 * 24 * 10,
        httpOnly: true                        /*working (sessionId is not changing) after disabling sameSite : "none"*/
    },
    store: new (pgSessionStore(session))({      /*posstgresStore can be used instead of (pgSessionStore(session)) */
        pool: db,   
        tableName: "user_session"
    })
}))
app.use("/api/upload", uploadHouseDetails)
app.use("/api/user", userDetails)
app.use("/api/authentication", userDetails)
app.use("/api/property-details", propertyDetails)
app.use("/api/user-property", userDetails)



app.get("/home-page", async (req, res) => {
    res.send("Hello world")
})













// POST requests API

// app.post("/upload/property-details", async (req, res) => {
//     const propertyDetails = req.body;
//     const objectkeys = Object.keys(propertyDetails);
//     const objectValues = Object.values(propertyDetails)
//     const columnNames = objectkeys.join(', ') //Converts array of keys into a single string seperated by ", "
//     const valuePlaceHolders = objectValues.map((_, index) => `$${index + 1}`).join(", ") //Generate placeholders for each value
//     const query = `INSERT INTO property (${columnNames}) VALUES (${valuePlaceHolders}) RETURNING *`


//     // upload property-details to db
//     try {
//         const result = await db.query(query, objectValues)
//         console.log(result.rows[0])
//         res.send("Successfully stored property details in database")
//     } catch (error) {
//         console.log(error)
//         res.send("Error storing property details")
//     }
// })


// app.post("/upload/locality-details", async (req, res) => {
//     const localityDetails = req.body
//     try {
//         const areaResult = await db.query('SELECT * FROM area WHERE area_name=$1', [localityDetails.area_name])
//         if (!areaResult.rows[0].area_id) {
//             try {
//                 const insertedResult = await db.query('INSERT INTO area (area_name, city_id) VALUES ($1, $2) RETURNING *', [localityDetails.area_name, localityDetails.city_id])
//                 console.log(`Area result : ${insertedResult.rows[0]}`)
//                 try {
//                     const result = await db.query('INSERT INTO locality (city_id, area_id, street) VALUES ($1, $2, $3) RETURNING *', [localityDetails.city_id, insertedResult.area_id, localityDetails.street])
//                     res.send("Uploaded area detials successfully")
//                     console.log(`Locality result : ${result.rows[0]}`)
//                 } catch (error) {
//                     res.status("Error status; 401", error)
//                 }
//             } catch (error) {
//                 res.status("Error status; 401", error)
//                 console.log(error)
//             }
//         } else {
//             try {
//                 const results = await db.query('INSERT INTO locality (city_id, area_id, street) VALUES ($1, $2, $3) RETURNING *', [localityDetails.city_id, areaResult.rows[0].area_id, localityDetails.street])
//                 res.send("Uploaded area detials successfully")
//                 console.log(`Locality result : ${results.rows[0]}`)
//             } catch (error) {
//                 res.status("Error status; 401", error)
//                 console.log(error)
//             }
//         }
//     } catch (error) {
//         console.log(error)
//         res.send(error)
//     }
//     // console.log("Locality Post request received successfully")
//     // console.log(req.body)
//     // res.send("Locality Post request received successfully")
// })


// app.post("/upload/rental-details", async (req, res) => {
//     const rentalDetails = req.body;
//     try {
//         console.log(rentalDetails)
//         const preferredTenantsKeys = Object.keys(rentalDetails.preferredTenants).join(", ")
//         const preferredTenantsValues = Object.values(rentalDetails.preferredTenants)
//         const preferredTenantsPlaceHolders = preferredTenantsValues.map((_, index) => `$${index + 1}`).join(", ")
//         const preferredTenantsQuery = `INSERT INTO preferred_tenants (${preferredTenantsKeys}) VALUES (${preferredTenantsPlaceHolders}) RETURNING id`
//         const preferredTenantsResult = await db.query(preferredTenantsQuery, preferredTenantsValues);
//         try {
//             const rentalDetailsCopy = { ...rentalDetails, preferred_tenants: preferredTenantsResult.rows[0].id }
//             delete rentalDetailsCopy.preferredTenants
//             const objectKeys = Object.keys(rentalDetailsCopy).join(", ")
//             const objectValues = Object.values(rentalDetailsCopy)
//             const queryPlaceHolders = objectValues.map((_, index) => `$${index + 1}`).join(", ")
//             const query = `INSERT INTO rental (${objectKeys}) VALUES (${queryPlaceHolders})`
//             const result = await db.query(query, objectValues);
//             res.send("Uploaded details successfully")
//         } catch (error) {
//             console.log(error)
//             res.send("Error while uploading house details", error)
//         }
//     } catch (error) {
//         console.log(error)
//         res.send("Error while uploading preferred tenants", error)
//     }


//     // console.log("Rental Post request received successfully")
//     // console.log(req.body)
//     // res.send("Rental Post request received successfully")
// })
// app.post("/upload/amenities-details", async (req, res) => {
//     const amenitiesDetails = req.body;
//     console.log(amenitiesDetails)
//     const additionalAmenitiesDetails = amenitiesDetails.additional_amenities;
//     try {
//         const additionalAmenitiesKeys = Object.keys(additionalAmenitiesDetails).join(", ")
//         const addtionalAmenitiesValues = Object.values(additionalAmenitiesDetails)
//         const additionalAmenitiesPlaceHolders = addtionalAmenitiesValues.map((_, index) => `$${index + 1}`).join(", ")
//         const additionalAmenitiesQuery = `INSERT INTO additional_amenities (${additionalAmenitiesKeys}) VALUES (${additionalAmenitiesPlaceHolders}) RETURNING id`
//         console.log(additionalAmenitiesQuery)
//         const additionalAmenitiesResult = await db.query(additionalAmenitiesQuery, addtionalAmenitiesValues)
//         try {
//             const amenitiesDetailsCopy = { ...amenitiesDetails, additional_amenities: additionalAmenitiesResult.rows[0].id }
//             const amenitiesKeys = Object.keys(amenitiesDetails).join(", ")
//             const amenitiesValues = Object.values(amenitiesDetailsCopy)
//             const amenitiesPlaceHolders = amenitiesValues.map((_, index) => `$${index + 1}`).join(", ");
//             const amenitiesQuery = `INSERT INTO amenities (${amenitiesKeys}) VALUES (${amenitiesPlaceHolders}) RETURNING *`
//             console.log(amenitiesValues)
//             const amenitiesResult = await db.query(amenitiesQuery, amenitiesValues)
//             res.send(amenitiesResult)
//             console.log(amenitiesResult)
//         } catch (error) {
//             res.send(error)
//             console.log(error)
//         }
//     } catch (error) {
//         res.send(error)
//         console.log(error)
//     }
//     // console.log("Amenities Post request received successfully")
//     // console.log(req.body)
//     // res.send("Amenities Post request received successfully")
// })

// const upload = multer({ dest: "C:/Users/punit/Desktop/Projects/LendHome/uploads" })

// app.post("/upload/gallery-details", upload.array("files", 10), async (req, res) => {
//     const imageFiles = req.files
//     try {
//         const insertedResult = await db.query('INSERT INTO images (images_array) VALUES ($1) RETURNING *', [imageFiles])
//         Array(insertedResult.rows[0]).forEach(image => {
//             console.log(image)
//         })
//     } catch (error) {
//         console.log(error)
//     }
// })
// app.post("/upload/schedule-details", async (req, res) => {
//     const scheduleDetails = req.body;
//     if (scheduleDetails.available_allday === true) {
//         scheduleDetails.start_time = "allday"
//         scheduleDetails.end_time = "allday"
//         console.log(scheduleDetails)
//     }
//     try {
//         const scheduleDetailsKeys = Object.keys(scheduleDetails).join(", ")
//         const scheduleDetailsValues = Object.values(scheduleDetails)
//         const scheduleDetailsPlaceHolders = scheduleDetailsValues.map((_, index) => `$${index + 1}`).join(", ")
//         const query = `INSERT INTO schedule (${scheduleDetailsKeys}) VALUES (${scheduleDetailsPlaceHolders}) RETURNING *`
//         const result = await db.query(query, scheduleDetailsValues)
//         console.log(result.rows[0])
//         res.send("Successfully uploaded files")
//     } catch (error) {
//         console.log(error)
//     }
// })

const port = process.env.SERVER_PORT
app.listen(port, () => {
    console.log("Server connection succeeded")
    console.log(`Server running on port ${port}`)
})

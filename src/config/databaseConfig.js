import pg from "pg"
import dotenv from "dotenv"
dotenv.config()
const db = new pg.Pool({
    user: process.env.PG_USER,
    server: process.env.PG_SERVER,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD
})

async function connectDatabase() {
    try {

        await db.connect()
        console.log("Database connection succeeded")
    } catch (err) {
        console.log(err)
    }
};
export default db
export {connectDatabase}
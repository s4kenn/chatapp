import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import { connectToDB } from './lib/db.js'

dotenv.config()


const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

connectToDB()
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
})
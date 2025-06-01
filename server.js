import express from "express"
import router from "./routes.js"
import { config } from "dotenv"

config({
    path : "./.env"
})

const app = express()

app.use(express.json())
app.use(router)

const PORT = process.env.PORT || 3000

app.listen(PORT , () => {
    console.log(`Server listening on port: ${PORT}`)
})
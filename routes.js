import express from "express"
import {submitJob , getStatus} from "./controllers.js"

const router = express.Router()

router.post("/submit-job" , submitJob)
router.get("/jobs/status/:id" , getStatus)

export default router
import client from "./redisClient.js"
import { enqueueJob } from "./controllers.js"

const processJob = async (jobId) => {
    const job = await client.get(jobId)
    const jobData = JSON.parse(job)
    try{
        if(jobData.picked_at === null){
            jobData.picked_at = new Date().toISOString()
            await client.set(jobId , JSON.stringify(jobData))
        }
        console.log("\n")
        console.log(`JOB ID ${jobData.id} , PRIORITY: ${jobData.priority}`)
        console.log(`Sending e-mail to: ${jobData.payload.to}`)
        console.log(`Subject: ${jobData.payload.subject}`)
        console.log(`Message: ${jobData.payload.message}`)

        const isFailed = await new Promise((resolve) => {
            setTimeout(() => resolve(Math.round(Math.random())), 1000)
        })

        if(isFailed){
            throw new Error("Email service stopped unexpectedly")
        }

        jobData.status = "completed"
        jobData.completed_at = new Date().toISOString()

        console.log(`JOB ID ${jobData.id} SUCCESSFUL`)
    }
    catch(e){
        console.log(`JOB ID ${jobData.id} FAILED: ${e.message}`)
        jobData.retries += 1
        console.log(`Retry count: ${jobData.retries}`)
        if(jobData.retries > 3){
            console.log("PERMANENTLY FAILED")
            jobData.status = "failed"
            jobData.failed_at = new Date().toISOString()
        }
        else{
            console.log("REQUEUING")
            jobData.status = "retrying"
            setTimeout(async () => await enqueueJob(jobData) , (2 ** jobData.retries) * 1000)
        }
    }
    await client.set(jobId , JSON.stringify(jobData))
}

const pollQueue = () => {
    setInterval(async () => {
        try{
            const jobId = await client.rPop('queue:high') || await client.rPop('queue:low')
            if(jobId){
                await processJob(jobId)
            }
        }
        catch(e){
            console.error(`Error polling queue: ${e.message}`)
        }
    } , 500)
}

pollQueue()
import client from "./redisClient.js";

const getId = () => Math.random().toString(36).slice(2, 11);

export const enqueueJob = async(jobData) => {
    const queueId = `queue:${jobData.priority}`
    const jobId = jobData.id || `job:${getId()}`
    if(jobData.id){
        await client.set(jobId , JSON.stringify(jobData))
    }
    else{
        await client.set(jobId , JSON.stringify({
            ...jobData,
            id : jobId,
            status : 'pending',
            created_at : new Date().toISOString(),
            picked_at : null,
            completed_at : null,
            failed_at : null,
            retries : 0
        }))
    }
    await client.lPush(queueId , jobId)
    return jobId
}

export const submitJob = async (req , res) => {
    try{
        const jobData = req.body
        const jobId = await enqueueJob(jobData)
        res.status(201).json({
            job_id : jobId,
            message : "Job submitted successfully"
        })
    }
    catch(e){
        console.error(`Error submitting job: ${e.message}`)
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export const getStatus = async (req , res) => {
    try{
        const job = await client.get(`job:${req.params.id}`)
        if(!job) return res.status(404).json({
            error: "Job not found"
        })
        const jobData = JSON.parse(job)
        res.json({
            status : jobData.status,
            created_at : jobData.created_at,
            picked_at : jobData.picked_at,
            completed_at : jobData.completed_at,
            failed_at : jobData.failed_at,
            retries : jobData.retries
        })
    }
    catch(e){
        console.error(`Error fetching job status: ${e.message}`)
        res.status(500).json({
            error : "Internal Server Error"
        })
    }
}
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.static('public')) //Serve the public folder

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`)
})
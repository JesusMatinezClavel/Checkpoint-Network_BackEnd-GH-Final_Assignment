import express, { Application } from "express";
import { Request, Response } from "express";
import cors from "cors";
import router from "./router";

const BodyParser = require('body-parser')

export const app: Application = express()

app.use(BodyParser.json({ limit: '300mb' }))
app.use(BodyParser.urlencoded({ limit: '300mb', extended: true }))
app.use(express.json())

app.use(cors())

app.get('/healthy', (req: Request, res: Response) => {
    res.status(200).json({
        serverUp: true,
        message: 'The server is healthy!'
    })
})

app.use('/api', router)
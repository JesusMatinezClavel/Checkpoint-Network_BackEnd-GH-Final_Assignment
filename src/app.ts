import express, { Application } from "express";
import { Request, Response } from "express";
import router from "./router";

export const app: Application = express()

app.use(express.json())

app.get('/healthy', (req: Request, res: Response) => {
    res.status(200).json({
        serverUp: true,
        message: 'The server is healthy!'
    })
})

app.use('/api', router)
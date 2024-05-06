import express, { Application } from "express";
import { Request, Response } from "express";
import cors from "cors";
import router from "./router";

export const app: Application = express()

app.use(express.json())
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:4000/api");
//     res.header("Access-Control-Allow-Methods", "GET, POST");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });

app.use(cors())

app.get('/healthy', (req: Request, res: Response) => {
    res.status(200).json({
        serverUp: true,
        message: 'The server is healthy!'
    })
})

app.use('/api', router)
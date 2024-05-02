import { Request, Response } from "express";


export const hola = (req: Request, res: Response) => { 
    res.status(200).json({
        success: true,
        message: 'good try'
    })
}
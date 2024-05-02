import { Response } from "express";

// Function to throw a Response in the Catch
export const catchStatus = (res: Response, statusCode: number, message: string, error: any) => {
    res.status(statusCode).json({
        success: false,
        message: message,
        error: error.message
    })
}


// Function to throw a Response in the Try
export const tryStatus = (res: Response, message: string, result: object) => {
    res.status(200).json({
        success: true,
        message: message,
        data: result
    })
}
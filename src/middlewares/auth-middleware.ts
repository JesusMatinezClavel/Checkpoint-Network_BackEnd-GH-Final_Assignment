import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import { TokenData } from "../types";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]      

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "TOKEN NOT FOUND"
            })
        }

        const isTokenValid = jwt.verify(token, process.env.JWT_secret as string) as TokenData

        if (!isTokenValid) {
            return res.status(401).json({
                success: false,
                message: 'INVALID TOKEN'
            })
        }

        req.tokenData = {
            userId: isTokenValid.userId,
            userName: isTokenValid.userName,
            roleName: isTokenValid.roleName
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'TOKEN ERROR',
            error: error
        })
    }
}
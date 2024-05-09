import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import 'dotenv/config'
import jwt from "jsonwebtoken";

// Models
import { User } from "../user/User";

export const register = async (req: Request, res: Response) => {
    try {
        let { name, avatar, email, password } = req.body

        // // Validations
        if (!name || !email || !password) {
            throw new Error('required fields')
        }
        const validAvatar = /(\.jpg|\.jpeg|\.png|\.gif|\.bmp)$/i;
        if (avatar && !validAvatar.test(avatar)) {
            throw new Error('invalid format')
        }
        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(email)) {
            throw new Error('invalid email')
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('invalid password')
        }

        const passwordEncrypted = bcrypt.hashSync(password, 8)

        const userEmail = await User.findOne({
            where: {
                email: email,
            }
        })

        const userName = await User.findOne({
            where: {
                name: name
            }
        })

        if (userEmail || userName) {
            throw new Error('user exists')
        }

        const newUser = await User.create({
            name,
            avatar: `${name}-${avatar}`,
            email,
            password: passwordEncrypted
        }).save()

        const { password: userPassword, ...restUser } = newUser

        tryStatus(res, 'Register succesful!', restUser)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('required fields'):
                    statusCode = 400
                    errorMessage = 'Name, email or password are necessary! '
                    break;
                case error.message.includes('invalid format'):
                    statusCode = 422
                    errorMessage = 'Invalid format for the selected avatar!'
                    break;
                case error.message.includes('invalid email'):
                    statusCode = 400
                    errorMessage = 'Invalid email!'
                    break;
                case error.message.includes('invalid password'):
                    statusCode = 400
                    errorMessage = 'Passwords needs to be 6-10 longer, and have an Uppercase, a Lowercase and a number'
                    break;
                case error.message.includes('user exists'):
                    statusCode = 409
                    errorMessage = 'User already exists!'
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT REGISTER', new Error(errorMessage))
    }
}
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new Error('required fields')
        }

        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(email)) {
            throw new Error('invalid email')
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('invalid password')
        }

        const user = await User.findOne({
            where: {
                email: email
            },
            relations: {
                role: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                isActive: true,
                role: {
                    id: true,
                    name: true
                }
            }
        })

        if (!user) {
            throw new Error('user doesnt exists')
        }

        const isValidPassword = bcrypt.compareSync(password, user?.password)
        if (!isValidPassword) {
            throw new Error('invalid authentification')
        }

        const token = jwt.sign({
            userId: user?.id,
            userName: user?.name,
            roleName: user?.role.name
        },
            process.env.JWT_secret as string,
            { expiresIn: '4h' }
        )

        await User.update(
            {
                id: user.id
            },
            {
                isActive: true
            }
        )

        const { isActive, name, ...restUser } = user

        const logged = {
            user: email,
            isActive: isActive,
            token
        }


        tryStatus(res, 'Loggin succesful!', logged)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('required fields'):
                    statusCode = 400
                    errorMessage = 'email and password are necessary! '
                    break;
                case error.message.includes('invalid email'):
                    statusCode = 400
                    errorMessage = 'Invalid email!'
                    break;
                case error.message.includes('invalid password'):
                    statusCode = 400
                    errorMessage = 'Passwords needs to be 6-10 longer, and have an Uppercase, a Lowercase and a number'
                    break;
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists!"
                    break;
                case error.message.includes('invalid authentification'):
                    statusCode = 401
                    errorMessage = "Password is incorrect!"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId

        const user = await User.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('user doesnt exists')
        }

        await User.update({ id: userId }, { isActive: false })

        tryStatus(res, 'Loggout succesful!', null)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists!"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
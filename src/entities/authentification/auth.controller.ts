import { Request, Response, response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

// Models
import { User } from "../user/User";


export const register = async (req: Request, res: Response) => {
    try {

        const { name, avatar, bio, birthdate, email, password } = req.body

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

        const birthdateDate = new Date(birthdate)
        const today = new Date()
        if (birthdateDate > today) {
            throw new Error('future date')
        }
        const birthdateformated = dayjs(birthdate).format('DD/MM/YYYY')

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('invalid password')
        }

        const passwordEncrypted = bcrypt.hashSync(password, 8)

        const user = await User.findOne({
            where: {
                name: name,
                email: email,
            }
        })

        if (user) {
            throw new Error('user exists')
        }

        const newUser = await User.create({
            name,
            avatar,
            bio,
            birthdate: birthdateformated,
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
                case error.message.includes('invalid date'):
                    statusCode = 400
                    errorMessage = 'Invalid given birthdate!'
                    break;
                case error.message.includes('future date'):
                    statusCode = 400
                    errorMessage = 'Birthdate given is in the future!'
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
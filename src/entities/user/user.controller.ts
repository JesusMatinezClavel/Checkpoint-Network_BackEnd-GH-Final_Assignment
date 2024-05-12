import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// Models
import { User } from "./User";
import { Upload } from "../upload/Upload";


export const getAllUsersBySuperadmin = async (req: Request, res: Response) => {
    try {
        const limit = 5
        const page = Number(req.query.page) || 1
        const skip = (page - 1) * limit
        const lengPosts = await Upload.find()

        if (page <= 0 || !Number.isInteger(page)) {
            throw new Error('page invalid')
        }
        if (skip >= lengPosts.length) {
            throw new Error('no more uploads')
        }

        const userId = req.tokenData.userId
        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ["role"]
        })

        if (!user) {
            throw new Error('user doesnt exists')
        } else if (user.role.id !== 3) {
            throw new Error('no superadmin')
        }

        const allUsers = await User.find({ relations: ['role', 'uploads'] })

        tryStatus(res, `${user.name}'s profile called succesfully`, allUsers)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('no superadmin'):
                    statusCode = 409
                    errorMessage = "You need to be superadmin to call all users"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT GET PROFILE BY ID', new Error(errorMessage))
    }
}
export const deleteUserBySuperadmin = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ["role"]
        })
        if (!user) {
            throw new Error('user doesnt exists')
        } else if (user.role.id !== 3) {
            throw new Error('no superadmin')
        }

        const userSelected = Number(req.params.id)

        const userToDelete = await User.findOne({
            where: {
                id: userSelected
            }
        })

        if (!userToDelete) {
            throw new Error('user selected invalid')
        }

        await User.delete(userSelected)

        const allUsers = await User.find({ relations: ['role', 'uploads'] })

        tryStatus(res, `${userToDelete.name} deleted succesfully`, allUsers)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('no superadmin'):
                    statusCode = 409
                    errorMessage = "You need to be superadmin to delete a user"
                    break;
                case error.message.includes('user selected invalid'):
                    statusCode = 409
                    errorMessage = "You need to be select a valid user to delete"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT GET PROFILE BY ID', new Error(errorMessage))
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id)


        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ["role", "uploads", "uploadComments.upload", "postComments.post", "followers", "following", "likes",]
        })
        console.log(user);

        if (!user) {
            throw new Error('user doesnt exists')
        }

        const { password, ...restUser } = user

        tryStatus(res, `${user.name}'s profile called succesfully`, restUser!)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT GET PROFILE BY ID', new Error(errorMessage))
    }
}
export const getOwnProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId

        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ["role", "uploads", "uploadComments.upload", "postComments.post", "followers", "following", "likes",]
        })

        if (!user) {
            throw new Error('user doesnt exists')
        }

        const { password, ...restUser } = user

        tryStatus(res, 'Own profile called succesfully', restUser)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT GET OWN PROFILE', new Error(errorMessage))
    }
}
export const updateOwnProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        let { name, avatar, bio, email, password, confirmPassword } = req.body

        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new Error('user doesnt exists')
        }
        if (name === "") {
            name = user.name
        }
        const userName = await User.findOne({
            where: {
                name: name
            }
        })
        if (userName && userName?.id !== userId) {
            throw new Error('invalid userName')
        }
        if (bio === "") {
            bio = user.bio
        }
        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (email === "") {
            email = user.email
        } else if (!validEmail.test(email)) {
            throw new Error('invalid email')
        } else if (avatar !== user.avatar) {
            const currentAvatar = path.join(__dirname, '../../../', 'img/avatars', user.avatar)
            if (fs.existsSync(currentAvatar)) {
                fs.unlinkSync(currentAvatar)
            }
        }
        const userEmail = await User.findOne({
            where: {
                email: email
            }
        })

        if (userEmail && userEmail?.id !== userId) {
            throw new Error('invalid userEmail')
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,10}$/;
        if (password === "") {
            password = user.password
        } else {
            if (!passwordRegex.test(password)) {
                throw new Error('invalid password')
            } else if (!confirmPassword || password !== confirmPassword) {
                throw new Error('invalid confirm password')
            }
            bcrypt.hashSync(password, 8)
        }

        if (avatar) {
            let filePath
            const validAvatar = /(\.jpg|\.jpeg|\.png|\.gif|\.bmp)$/i;
            if (!validAvatar.test(avatar)) {
                throw new Error('invalid format')
            } else if (user.avatar !== `${user.name}-undefined` && user.avatar !== "") {
                filePath = path.join(__dirname, '../../../', 'img/avatars', `${user.avatar}`)
                if (filePath && !fs.existsSync(filePath)) {
                    user.avatar = 'default-ProfileImg.png'
                } else {
                    fs.unlinkSync(filePath)
                }
            }
        } else {
            avatar = user.avatar
        }

        await User.update(
            {
                id: userId
            },
            {
                name: name,
                bio: bio,
                avatar: avatar,
                email: email,
                password: password
            }
        )

        const updatedUser = await User.findOne({
            where: {
                id: userId
            }
        })

        const restUser = {
            name: updatedUser?.name,
            bio: updatedUser?.bio,
            avatar: updatedUser?.avatar,
            email: updatedUser?.email
        }

        tryStatus(res, 'Own profile updated succesfully', restUser)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('invalid format'):
                    statusCode = 422
                    errorMessage = 'Invalid format for the selected avatar!'
                    break;
                case error.message.includes('invalid userName'):
                    statusCode = 400
                    errorMessage = 'Name already in use!'
                    break;
                case error.message.includes('invalid userEmail'):
                    statusCode = 400
                    errorMessage = 'Email anready in use!'
                    break;
                case error.message.includes('invalid email'):
                    statusCode = 400
                    errorMessage = 'Invalid email!'
                    break;
                case error.message.includes('invalid password'):
                    statusCode = 400
                    errorMessage = 'Password needs to be 6-10 longer, and have an Uppercase, a Lowercase and a number'
                    break;
                case error.message.includes('invalid confirm password'):
                    statusCode = 402
                    errorMessage = 'Password does not match with confirm password'
                    break;
                case error.message.includes('file not found'):
                    statusCode = 402
                    errorMessage = 'Cannot find the previous avatar to delete it'
                    break;
                default:
                    break;
            }
        res.status(500).json({
            succes: false,
            message: 'CANNOT UPLOAD PROFILE',
            error: error
        })
    }
}
export const deleteOwnUser = async (req: Request, res: Response) => {
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

        const modelsPath = path.join(__dirname, '../../../', '3D-Models', user.name);

        if (!fs.existsSync(modelsPath)) {
            throw new Error('no folder')
        } else {
            fs.rmdir(modelsPath, { recursive: true }, (err) => {
                if (err) {
                    throw new Error('Failed to delete user folder');
                }
            });
        }

        const avatarPath = path.join(__dirname, '../../../', 'img/avatars', user.avatar)

        if (!fs.existsSync(avatarPath)) {
            throw new Error('no avatar')
        } else {
            fs.unlink(avatarPath, (err) => {
                if (err) {
                    throw new Error('Failed to delete user file');
                }
            });
        }

        await User.delete(userId)

        tryStatus(res, 'User deleted', null)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('no folder'):
                    statusCode = 409
                    errorMessage = "No folder found for the user"
                    break;
                case error.message.includes('no avatar'):
                    statusCode = 409
                    errorMessage = "No avatar found for the user"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
export const addRemoveLikes = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ['likes']
        })
        if (!user) {
            throw new Error('user doesnt exists')
        }

        const uploadId = Number(req.params.id)
        const upload = await Upload.findOne({
            where: {
                id: uploadId
            },
            relations: ['liked']
        })
        if (!upload) {
            throw new Error('upload doesnt exists')
        }

        const existUpload = user.likes.some(like => like.id === uploadId);
        if (existUpload) {
            user.likes = user.likes.filter(like => like.id !== uploadId);
            await user.save();
            tryStatus(res, 'Upload disliked', upload.liked);
        } else {
            user.likes.push(upload);
            await user.save();
            tryStatus(res, 'Upload liked', upload.liked);
        }
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 402
                    errorMessage = 'User doesnt exists'
                    break;
                case error.message.includes('upload doesnt exists'):
                    statusCode = 402
                    errorMessage = 'Upload selected doesnt exists'
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LIKE/DISLIKE', new Error(errorMessage))
    }
}
export const followUnfollow = async (req: Request, res: Response) => {
    try {
        const ownUserId = req.tokenData.userId
        const ownUser = await User.findOne({
            where: {
                id: ownUserId
            },
            relations: ['following']
        })
        if (!ownUser) {
            throw new Error('user doesnt exists')
        }

        const followUserId = Number(req.params.id)
        const followUser = await User.findOne({
            where: {
                id: followUserId
            },
            relations: ['followers']
        })
        if (!followUser) {
            throw new Error('upload doesnt exists')
        }

        if (ownUserId === followUserId) {
            throw new Error('cannot oneself');
        }

        const isFollowed = ownUser.following.some(user => user.id === followUserId);

        const ownUserBasic = await User.findOne({
            where: {
                id: ownUserId
            }
        }) as User
        const followUserBasic = await User.findOne({
            where: {
                id: followUserId
            }
        }) as User


        if (isFollowed) {
            ownUser.following = ownUser.following.filter(user => user.id !== followUserId)
            followUser.followers = followUser.followers.filter(user => user.id !== ownUserId)
            await ownUser.save()
            await followUser.save()
            tryStatus(res, 'Unfollowing user', ownUser)
        } else {
            ownUser.following.push(followUserBasic)
            followUser.followers.push(ownUserBasic)
            await ownUser.save()
            await followUser.save()
            tryStatus(res, 'Following user', ownUser)
        }
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 402
                    errorMessage = 'User doesnt exists'
                    break;
                case error.message.includes('upload doesnt exists'):
                    statusCode = 402
                    errorMessage = 'Upload selected doesnt exists'
                    break;
                case error.message.includes('cannot oneself'):
                    statusCode = 402
                    errorMessage = 'You cannot follow yourself'
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT FOLLOW/UNFOLLOW', new Error(errorMessage))
    }
}
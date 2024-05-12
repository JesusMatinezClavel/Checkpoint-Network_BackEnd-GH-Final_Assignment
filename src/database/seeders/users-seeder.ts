import { fa, faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// Models
import { User } from "../../entities/user/User";
import { Role } from "../../entities/role/Role";

export const seedControlUsers = async () => {

    const controlUser = new User()
    controlUser.name = 'user'
    controlUser.avatar = 'user-default-ProfileImg.png'
    controlUser.bio = faker.person.bio()
    controlUser.email = 'user@email.com'
    controlUser.password = bcrypt.hashSync('Aa123456', 8)
    controlUser.isActive = false
    controlUser.role = {
        id: 1
    } as Role
    controlUser.createdAt = new Date()
    controlUser.updatedAt = new Date()
    await controlUser.save()
    const userAvatarPath = path.join(__dirname, '../../../seeder-files/default-ProfileImg.png')
    const userDestinationPath = path.join(__dirname, '../../../', 'img/', 'avatars')
    fs.copyFileSync(userAvatarPath, path.join(userDestinationPath, `${controlUser.name}-default-ProfileImg.png`))

    const controlAdmin = new User()
    controlAdmin.name = 'admin'
    controlAdmin.avatar = 'admin-default-ProfileImg.png'
    controlAdmin.bio = faker.person.bio()
    controlAdmin.email = 'admin@email.com'
    controlAdmin.password = bcrypt.hashSync('Aa123456', 8)
    controlAdmin.isActive = false
    controlAdmin.role = {
        id: 2
    } as Role
    controlAdmin.createdAt = new Date()
    controlAdmin.updatedAt = new Date()
    await controlAdmin.save()
    const adminAvatarPath = path.join(__dirname, '../../../seeder-files/default-ProfileImg.png')
    const adminDestinationPath = path.join(__dirname, '../../../', 'img/', 'avatars')
    fs.copyFileSync(adminAvatarPath, path.join(adminDestinationPath, `${controlAdmin.name}-default-ProfileImg.png`))


    const controlSuper = new User()
    controlSuper.name = 'superadmin'
    controlSuper.avatar = 'superadmin-default-ProfileImg.png'
    controlSuper.bio = faker.person.bio()
    controlSuper.email = 'superadmin@email.com'
    controlSuper.password = bcrypt.hashSync('Aa123456', 8)
    controlSuper.isActive = false
    controlSuper.role = {
        id: 3
    } as Role
    controlSuper.createdAt = new Date()
    controlSuper.updatedAt = new Date()
    await controlSuper.save()
    const superadminAvatarPath = path.join(__dirname, '../../../seeder-files/default-ProfileImg.png')
    const superadminDestinationPath = path.join(__dirname, '../../../', 'img/', 'avatars')
    fs.copyFileSync(superadminAvatarPath, path.join(superadminDestinationPath, `${controlSuper.name}-default-ProfileImg.png`))


    console.log('----------------------');
    console.log('Control users created!');
    console.log('----------------------');

}
const generateRandomUsers = async () => {
    let unique = false;
    let name;
    let randomUser = new User();
    let existingUser

    const avatarPath = path.join(__dirname, '../../../seeder-files/default-ProfileImg.png')
    const destinationPath = path.join(__dirname, '../../../', 'img/', 'avatars')

    while (!unique) {
        name = faker.person.firstName();
        try {
            existingUser = await User.findOne({ where: { name: name } });
            !existingUser
                ? (
                    unique = true,
                    randomUser.name = name,
                    randomUser.avatar = `${randomUser.name}-default-ProfileImg.png`,
                    randomUser.bio = faker.person.bio(),
                    randomUser.email = faker.internet.email({ firstName: name, provider: 'email.com' }),
                    randomUser.password = bcrypt.hashSync(faker.internet.password({ length: 8, memorable: true }) + faker.number.int({ min: 0, max: 9 }), 8),
                    randomUser.createdAt = new Date(),
                    randomUser.updatedAt = new Date(),
                    fs.copyFileSync(avatarPath, path.join(destinationPath, `${randomUser.name}-default-ProfileImg.png`))
                )
                : generateRandomUsers()
        } catch (error) {
            console.log(error);

        }
    }

    return randomUser;
}

export const seedRandomUsers = async () => {

    const userPromises = Array.from({ length: 17 }, generateRandomUsers)
    const randomUsers = await Promise.all(userPromises)
    await User.save(randomUsers)

    console.log('---------------------');
    console.log('Random users created!');

    const users = await User.find({ relations: ['followers', 'following'] });

    for (const user of users) {
        const updateUser = await User.findOne({
            where: {
                id: user.id
            },
            relations: [
                'followers',
                'following'
            ]
        })

        const followers = [...users.slice(0, faker.number.int({ min: 1, max: 10 }))]
        const following = [...users.slice(11, faker.number.int({ min: 12, max: 20 }))]

        updateUser!.followers = followers
        updateUser!.following = following

        for (const follower of followers) {
            const followerUser = await User.findOne({
                where: { id: follower.id },
                relations: ['following']
            });
            followerUser!.following = [...followerUser!.following, updateUser!];
            await User.save(followerUser!);
        }

        for (const followed of following) {
            const followedUser = await User.findOne({
                where: { id: followed.id },
                relations: ['followers']
            });
            followedUser!.followers = [...followedUser!.followers, updateUser!];
            await User.save(followedUser!);
        }


        await User.save(updateUser!)
    }


    console.log('------ Users updated!');
    console.log('---------------------');
}
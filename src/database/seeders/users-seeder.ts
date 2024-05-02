import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// Models
import { User } from "../../entities/user/User";
import { Role } from "../../entities/role/Role";

export const seedControlUsers = async () => {

    const controlUser = new User()
    controlUser.name = 'user'
    controlUser.avatar = faker.image.avatar()
    controlUser.bio = faker.lorem.sentence()
    controlUser.email = 'user@email.com'
    controlUser.password = bcrypt.hashSync('Aa123456', 8)
    controlUser.birthdate = new Date('1992-06-04')
    controlUser.isActive = false
    controlUser.role = {
        id: 1
    } as Role
    controlUser.createdAt = new Date()
    controlUser.updatedAt = new Date()
    await controlUser.save()

    const controlAdmin = new User()
    controlAdmin.name = 'admin'
    controlAdmin.avatar = faker.image.avatar()
    controlAdmin.bio = faker.lorem.sentence()
    controlAdmin.email = 'admin@email.com'
    controlAdmin.password = bcrypt.hashSync('Aa123456', 8)
    controlAdmin.birthdate = new Date('1992-06-04')
    controlAdmin.isActive = false
    controlAdmin.role = {
        id: 2
    } as Role
    controlAdmin.createdAt = new Date()
    controlAdmin.updatedAt = new Date()
    await controlAdmin.save()

    const controlSuper = new User()
    controlSuper.name = 'superadmin'
    controlSuper.avatar = faker.image.avatar()
    controlSuper.bio = faker.lorem.sentence()
    controlSuper.email = 'superadmin@email.com'
    controlSuper.password = bcrypt.hashSync('Aa123456', 8)
    controlSuper.birthdate = new Date('1992-06-04')
    controlSuper.isActive = false
    controlSuper.role = {
        id: 3
    } as Role
    controlSuper.createdAt = new Date()
    controlSuper.updatedAt = new Date()
    await controlSuper.save()

    console.log('----------------------');
    console.log('Control users created!');
    console.log('----------------------');

}
const generateRandomUsers = async () => {
    const randomUser = new User()
    const name = randomUser.name = faker.person.firstName()
    randomUser.avatar = faker.image.avatar()
    randomUser.bio = faker.lorem.sentence()
    randomUser.email = faker.internet.email({ firstName: name, provider: 'email.com' })
    randomUser.password = bcrypt.hashSync(faker.internet.password({ length: 8, memorable: true }) + faker.number.int({ min: 0, max: 9 }), 8)
    randomUser.birthdate = faker.date.between({ from: '1990-01-01T00:00:00.000Z', to: '2012-12-31T00:00:00.000>' })
    randomUser.createdAt = new Date()
    randomUser.updatedAt = new Date()

    return randomUser

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

        updateUser!.followers = [...users.slice(0, faker.number.int({ min: 1, max: 10 }))]
        updateUser!.following = [...users.slice(11, faker.number.int({ min: 12, max: 20 }))]
        await User.save(updateUser!)
    }


    console.log('------ Users updated!');
    console.log('---------------------');
}
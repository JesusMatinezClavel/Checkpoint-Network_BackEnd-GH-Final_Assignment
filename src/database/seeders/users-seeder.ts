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

    // const userPromises = Array.from({ length: 17 }, generateRandomUsers)
    // const randomUsers = await Promise.all(userPromises)
    // await User.save(randomUsers)

    const users = await User.find({relations:['followers','following']});
    // // // // users[2].followers = [...users.slice(3, 5)]
    // // console.log(users[0].followers);

    const updateUser = await User.findOne({
        where:{
            id: 2
        },
        relations:[
            'followers',
            'following'
        ]
    })

    updateUser!.followers = [...users.slice(5,8)]
    // updateUser!.following = [...[users[4],users[12]]]
    // await User.save(updateUser!)

    console.log(updateUser);
    


    // for (const user of users) {
    //     const updateUser = await User.findOne({ where: { id: user.id }, relations: ['followers', 'following'] });

    //     // const newFollowers = users.slice(0, faker.number.int({ min: 1, max: 19 })).filter(u => u.id !== user.id);
    //     // const newFollowing = users.slice(0, faker.number.int({ min: 1, max: 19 })).filter(u => u.id !== user.id);
    //     const newFollowers = users.slice(0, 2).filter(u => u.id !== user.id);
    //     const newFollowing = users.slice(0, 2).filter(u => u.id !== user.id);
    //     // console.log(newFollowers);

    //     updateUser!.followers = [...newFollowers];
    //     updateUser!.following = [...newFollowing];

    //     // // Guardar los cambios en la base de datos
    //     await User.save(updateUser!);
    // }

    // const user = await User.createQueryBuilder('user')
    //     .leftJoinAndSelect('user.followers', 'follower')
    //     .leftJoinAndSelect('user.following', 'following')
    //     .where('user.id = :id', { id: 1 })
    //     .getOne();

    // console.log(user);





    console.log('---------------------');
    console.log('Random users created!');
    console.log('---------------------');

}
import { es, faker } from "@faker-js/faker";
import { AppDataSource } from "../db";

// Models
import { User } from "../../entities/user/User";
import { Role } from "../../entities/role/Role";

export const seedControlUsers = async () => {

    const controlUser = new User()
    controlUser.name = 'user'
    controlUser.avatar = faker.image.avatar()
    controlUser.bio = faker.lorem.sentence()
    controlUser.email = 'user@email.com'
    controlUser.password = 'Aa123456'
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
    controlAdmin.password = 'Aa123456'
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
    controlSuper.password = 'Aa123456'
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

export const seedRandomUsers = async () => {

    const randomUser = new User()
    randomUser.name = faker.person.firstName()
}
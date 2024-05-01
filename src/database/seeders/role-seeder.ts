import { AppDataSource } from "../db";
import { Role } from "../../entities/role/Role";

export const seedRoles = async () => {

    const user = new Role()
    user.name = 'user'
    user.createdAt = new Date()
    user.updatedAt = new Date()
    await user.save()

    const admin = new Role()
    admin.name = 'admin'
    admin.createdAt = new Date()
    admin.updatedAt = new Date()
    await admin.save()

    const superadmin = new Role()
    superadmin.name = 'superadmin'
    superadmin.createdAt = new Date()
    superadmin.updatedAt = new Date()
    await superadmin.save()

    console.log('----------------------');
    console.log('Control roles created!');
    console.log('----------------------');
}
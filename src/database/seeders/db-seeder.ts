import { AppDataSource } from "../db";

// Seeders
import { seedRoles } from "./role-seeder";
import { seedControlUsers } from "./users-seeder";


const seedDB = async () => {
    await AppDataSource.initialize()

        .then(() => seedRoles())
        .then(() => seedControlUsers())

        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            AppDataSource.destroy()
        })
}

seedDB()
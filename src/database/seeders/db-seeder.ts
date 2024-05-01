import { AppDataSource } from "../db";

// Seeders
import { seedRoles } from "./role-seeder";
import { seedControlUsers, seedRandomUsers } from "./users-seeder";


const seedDB = async () => {
    await AppDataSource.initialize()

        // .then(() => seedRoles())
        // .then(() => seedControlUsers())
        .then(() => seedRandomUsers())

        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            AppDataSource.destroy()
        })
}

seedDB()
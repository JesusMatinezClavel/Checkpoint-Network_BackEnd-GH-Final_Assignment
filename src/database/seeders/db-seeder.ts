import { AppDataSource } from "../db";
import { seedRoles } from "./role-seeder";

// Seeders


const seedDB = async () => {
    await AppDataSource.initialize()
        .then(() => seedRoles())

        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            AppDataSource.destroy()
        })
}

seedDB()
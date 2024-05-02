import { Upload } from "../../entities/upload/Upload";
import { AppDataSource } from "../db";

// Seeders
import { seedRoles } from "./role-seeder";
import { seedControlUploads } from "./upload-seeder";
import { seedControlUsers, seedRandomUsers } from "./users-seeder";


const seedDB = async () => {
    await AppDataSource.initialize()

    // .then(() => seedRoles())
    // .then(() => seedControlUsers())
    // .then(() => seedRandomUsers())
    .then(() => seedControlUploads())    
    
    .catch ((error) => {
        console.log(error);
    })
    .finally(() => {
        AppDataSource.destroy()
    })
}

seedDB()
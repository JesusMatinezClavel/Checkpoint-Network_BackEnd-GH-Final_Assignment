import { Upload } from "../../entities/upload/Upload";
import { AppDataSource } from "../db";
import { seederControlPosts } from "./post-seeder";
import { seedControlPostComments } from "./postComments-seeder";

// Seeders
import { seedRoles } from "./role-seeder";
import { seedControlUploads } from "./upload-seeder";
import { seedControlUploadComments } from "./uploadComments-seeder";
import { seedControlUsers, seedRandomUsers } from "./users-seeder";


const seedDB = async () => {
    await AppDataSource.initialize()

        .then(() => seedRoles())
        .then(() => seedControlUsers())
        .then(() => seedRandomUsers())
        .then(() => seedControlUploads())
        .then(() => seedControlUploadComments())
        .then(() => seederControlPosts())
        .then(() => seedControlPostComments())

        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            AppDataSource.destroy()
        })
}

seedDB()
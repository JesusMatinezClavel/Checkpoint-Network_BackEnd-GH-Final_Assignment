import "reflect-metadata"
import 'dotenv/config'
import { DataSource } from "typeorm";
import { Roles1714409133837 } from "./migrations/1714409133837-roles";
import { Users1714409172948 } from "./migrations/1714409172948-users";
import { Uploads1714409184938 } from "./migrations/1714409184938-uploads";
import { UploadComments1714409199309 } from "./migrations/1714409199309-upload_comments";
import { Posts1714409207331 } from "./migrations/1714409207331-posts";
import { PostComments1714409218931 } from "./migrations/1714409218931-post_comments";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_host || 'localhost',
    port: Number(process.env.DB_port) || 3306,
    username: process.env.DB_username || 'root',
    password: process.env.DB_password || "",
    database: process.env.DB_database || 'checkpoint',
    migrations: [Roles1714409133837, Users1714409172948, Uploads1714409184938, UploadComments1714409199309, Posts1714409207331, PostComments1714409218931],
    entities: [],
    synchronize: false,
    logging: false
})
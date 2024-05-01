import "reflect-metadata"
import 'dotenv/config'
import { DataSource } from "typeorm";

// Migrations
import { Roles1714409133837 } from "./migrations/1714409133837-roles";
import { Users1714409172948 } from "./migrations/1714409172948-users";
import { Uploads1714409184938 } from "./migrations/1714409184938-uploads";
import { UploadComments1714409199309 } from "./migrations/1714409199309-upload_comments";
import { Posts1714409207331 } from "./migrations/1714409207331-posts";
import { PostComments1714409218931 } from "./migrations/1714409218931-post_comments";
import { Followers1714588979495 } from "./migrations/1714588979495-followers";


// Models
import { Role } from "../entities/role/Role";
import { User } from "../entities/user/User";
import { Upload } from "../entities/upload/Upload";
import { UploadComment } from "../entities/upload_comment/UploadComment";
import { Post } from "../entities/post/Post";
import { PostComment } from "../entities/post_comment/PostComment";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_host || 'localhost',
    port: Number(process.env.DB_port) || 3306,
    username: process.env.DB_username || 'root',
    password: process.env.DB_password || "",
    database: process.env.DB_database || 'checkpoint',
    migrations: [Roles1714409133837, Users1714409172948, Uploads1714409184938, UploadComments1714409199309, Posts1714409207331, PostComments1714409218931, Followers1714588979495],
    entities: [Role, User, Upload, UploadComment, Post, PostComment],
    synchronize: false,
    logging: false
})
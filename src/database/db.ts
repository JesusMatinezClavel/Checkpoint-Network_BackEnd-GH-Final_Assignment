import "reflect-metadata"
import { DataSource } from "typeorm";
import { Roles1714409133837 } from "./migrations/1714409133837-roles";
import { Users1714409172948 } from "./migrations/1714409172948-users";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3307,
    username: 'root',
    password: '1234',
    database: 'checkpoint',
    migrations:[Roles1714409133837, Users1714409172948],
    entities: [],
    synchronize: false,
    logging: false
})
import * as dotenv from 'dotenv'
import { Sequelize } from "sequelize-typescript";
import TaskEntity from "./entities/task.entity";
import UserEntity from "./entities/user.entity";

dotenv.config();

const createDatabase = async () => {
    console.log("Creating database...");

    const conn = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: <number><unknown>process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_NAME,
        logging: false,
    });

    conn.addModels([UserEntity, TaskEntity]);

    await conn.sync({ force: true });

    console.log("Database created!");
};

createDatabase();
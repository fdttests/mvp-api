import App from './app';
import * as dotenv from 'dotenv'
import AuthController from './controllers/auth.controller';
import { SequelizeOptions } from 'sequelize-typescript';
import TaskController from './controllers/task.controller';
import TaskEntity from './entities/task.entity';
import UserEntity from './entities/user.entity';

dotenv.config();

const controllers = [
  new AuthController(),
  new TaskController(),
];

const entities = [
  UserEntity, TaskEntity
]

const dbConfig: SequelizeOptions = {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: <number><unknown>process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  logging: false,
};

const app = new App(
  dbConfig,
  controllers,
  entities,
  3333,
);

app.boot();
app.listen();
import * as bodyParser from 'body-parser';
import express from 'express'
import Controller from './@shared/controllers/controller';
import { ModelCtor, Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { ValidationError } from 'express-validation';

class App {
  public app!: express.Application;
 
  constructor(
    private dbConfig: SequelizeOptions,
    private controllers: Controller[],
    private entities: ModelCtor[],
    private port: number
  ) {
    this.boot();
  }
 
  public async boot() {
    this.app = express();
 
    await this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private async initializeDatabase() {
    const conn = new Sequelize(this.dbConfig);

    conn.addModels(this.entities);

    await conn.sync();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeErrorHandling() {
    this.app.use((err: any, req: any, res: any, next: any) => {
        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json(err);
        }
    
        return res.status(500).json(err);
    });
  }

  private initializeControllers() {
    this.controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }
}
 
export default App;
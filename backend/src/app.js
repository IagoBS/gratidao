import express from 'express';
import path from 'path';
import routes from './routes';
import './database/index';

class App {
  constructor() {
    this.server = express();
    this.middwares();
    this.routes();
  }

  middwares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'images'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;

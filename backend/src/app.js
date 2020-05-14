import 'dotenv/config';
import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import SentryConfig from './config/sentry';
import 'express-async-errors';
import routes from './routes';
import './database/index';

class App {
  constructor() {
    this.server = express();

    Sentry.init(SentryConfig);

    this.middwares();
    this.routes();
    this.exceptionHandler();
  }

  middwares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'images'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (error, request, response, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(error, request).toJSON();
        return response.status(500).json(errors);
      }
      return response.status(500).json({ error: 'Error Internal Server' });
    });
  }
}

export default new App().server;

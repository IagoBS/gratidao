import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import File from '../app/models/File';
import Message from '../app/models/Message';
import Category from '../app/models/Category';
import databaseConfig from '../config/database';

const models = [User, File, Message, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gratidao',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}
export default new Database();

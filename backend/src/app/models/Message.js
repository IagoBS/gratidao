import Sequelize, { Model } from 'sequelize';

class Message extends Model {
  static init(sequelize) {
    super.init(
      {
        messages: Sequelize.STRING,
        deleted_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'usuario' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  }
}
export default Message;

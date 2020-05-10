import Sequelize, { Model } from 'sequelize';

class ForgotPassword extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.STRING,
        token_hash: Sequelize.STRING,
        token_created_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default ForgotPassword;

import token from 'jsonwebtoken';
import User from '../models/User';
import jwt from '../../config/auth';

class SessionController {
  async store(request, response) {
    const { email, password } = request.body;
    const userFindEmail = await User.findOne({
      where: { email },
    });

    if (!userFindEmail) {
      return response.status(400).json({
        error:
          'Erro ao encontrar email, tente novamente ou crie uma conta - User not found',
      });
    }

    if (!(await userFindEmail.checkPassword(password))) {
      return response.status(401).json({
        error: 'Senha está incorreta, tente novamente - Password not found',
      });
    }

    const { id, name } = userFindEmail;

    return response.json({
      userFindEmail: {
        id,
        name,
        email,
      },
      token: token.sign({ id }, jwt.secret, {
        expiresIn: jwt.expiresIn,
      }),
    });
  }
}

export default new SessionController();

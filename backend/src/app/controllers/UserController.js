import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(request, response) {
    const user = await User.findAll();

    return response.json(user);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Erro ao cadastrar usuário tente novamente - validation fails',
      });
    }

    const userFindExistEmail = await User.findOne({
      where: { email: request.body.email },
    });

    if (userFindExistEmail) {
      return response.status(400).json({
        error:
          'Erro: este e-mail já está cadastrado, tente novamente - User already exists',
      });
    }

    const { id, name, email, provider } = await User.create(request.body);

    return response.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Erro ao cadastrar usuário tente novamente - validation fails',
      });
    }

    const { email, oldPassword } = request.body;

    const user = await User.findByPk(request.userId);

    if (email !== user.email) {
      const userFindExistEmail = await User.findOne({
        where: { email },
      });

      if (userFindExistEmail) {
        return response.status(400).json({
          error:
            'Erro: este e-mail já está cadastrado, tente novamente - User already exists',
        });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return response.status(401).json({
        error: 'Senha atual está incorreta tente novamente - bad request',
      });
    }

    const { id, name, provider } = await user.update(request.body);

    return response.json({
      id,
      name,
      email,
      provider,
    });
  }
}
export default new UserController();

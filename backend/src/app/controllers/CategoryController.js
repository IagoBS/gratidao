import * as Yup from 'yup';
import User from '../models/User';
import Category from '../models/Category';

class CategoryController {
  async store(request, response) {
    const ValidateUserProvider = User.findOne({
      where: { provider: true },
    });
    if (!(await ValidateUserProvider)) {
      return response.status(403).json({
        error:
          'erro ao criar categoria, tente novamente - Request inauthorization',
      });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Erro ao cadastrar usuário tente novamente - validation fails',
      });
    }

    const { id, name } = await Category.create(request.body);

    return response.json({ id, name });
  }
}

export default new CategoryController();

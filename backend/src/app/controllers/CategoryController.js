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

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      if (!(await schema.isValid(request.body))) {
        return response.status(400).json({
          error: 'Erro ao cadastrar usuário tente novamente - validation fails',
        });
      }

      const checkUser = await User.findOne({
        where: { provider: true },
      });

      if (!checkUser) {
        return response.status(401).json({
          error: 'Erro ao editar categoria, tente novamente - Unauthorized',
        });
      }

      const category = await Category.findByPk(request.params.id);

      const { name } = category.update(request.body);

      return response.json({ name });
    } catch (err) {
      return response
        .status(400)
        .json(`Erro ao editar categoria tente novamente ${err.message}`);
    }
  }

  async delete(request, response) {
    try {
      const checkUser = await User.findOne({
        where: { provider: true },
      });

      if (!checkUser) {
        return response.status(401).json({
          error: 'Erro ao editar categoria, tente novamente - Unauthorized',
        });
      }

      const category = await Category.findByPk(request.params.id);

      await category.destroy();

      return response.json();
    } catch (err) {
      return response
        .status(400)
        .json(`Erro ao deletar categoria, tente novamente ${err.message}`);
    }
  }
}

export default new CategoryController();

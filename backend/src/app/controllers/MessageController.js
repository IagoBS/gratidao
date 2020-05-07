import * as Yup from 'yup';
import Message from '../models/Message';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class MessageController {
  async index(request, response) {
    const { page = 1 } = request.query;

    const message = await Message.findAll({
      where: { user_id: request.userId, deleted_at: null },
      order: ['created_at'],
      attributes: ['id', 'messages'],
      limit: 6,
      offset: (page - 1) * 6,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        },
      ],
    });
    return response.json(message);
  }

  async store(request, response) {
    const shema = Yup.object().shape({
      messages: Yup.string().required(),
      provider_id: Yup.number().required(),
      category_id: Yup.number().required(),
      date: Yup.date(),
    });

    if (!(await shema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Erro ao cadastrar mensagem tente novamente - Bad Request',
      });
    }

    const { provider_id, messages, category_id, date } = request.body;

    const checkToUser = await User.findOne({
      where: { id: provider_id },
    });
    if (!checkToUser) {
      return response.status(403).json({
        error:
          'erro ao criar mensagem, tente novamente ou mais tarde - bad request: inauthorization',
      });
    }

    const checkProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    /**
     * Notification provider
     */
    if (checkProvider) {
      await Notification.create({
        message: messages,
        user: provider_id,
      });
    }

    const createMessage = await Message.create({
      user_id: request.userId,
      provider_id,
      messages,
      category_id,
      date,
    });

    return response.json(createMessage);
  }

  async update(request, response) {
    try {
      const shema = Yup.object().shape({
        messages: Yup.string().required(),
        category_id: Yup.number().required(),
      });

      if (!(await shema.isValid(request.body))) {
        return response.status(400).json({
          error: 'Erro ao cadastrar mensagem tente novamente - Bad Request',
        });
      }
      const message = await Message.findByPk(request.params.id);

      const { id, messages, category_id } = await message.update(request.body);

      return response.json({
        id,
        messages,
        category_id,
      });
    } catch (err) {
      return response.status(400).json({
        error: `erro ao editar mensagem, tente novamente - ${err.message}`,
      });
    }
  }

  async delete(request, response) {
    try {
      const message = await Message.findByPk(request.params.id);

      if (message.user_id !== request.userId) {
        return response.status(401).json({
          error:
            'Erro ao deletar mensagem, tente novamente - Delete message is unauthorized',
        });
      }

      await message.destroy();
      return response.json();
    } catch (err) {
      return response.status(400).json({
        error: `Erro ao deletar usuário, tente novamente ${err.message}`,
      });
    }
  }
}
export default new MessageController();

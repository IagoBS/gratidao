import * as Yup from 'yup';
import Message from '../models/Message';
import User from '../models/User';
import File from '../models/File';

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

    if (checkProvider) {
      // manda para fila de notificações
      // const hourStart = startOfHour(parseISO(date));
      // if (isBefore(hourStart, new Date())) {
      //   return response
      //     .status(400)
      //     .json({ error: 'Operação negada - Past date a not permited' });
      // }
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

  async show(request, response) {
    const message = await Message.findAll({
      where: { user_id: request.userId, deleted_at: null },
      order: ['created_at'],
      attributes: ['id', 'usuario'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return response.json(message);
  }

  async update(request, response) {
    const shema = Yup.object().shape({
      messages: Yup.string().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await shema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Erro ao cadastrar mensagem tente novamente - Bad Request',
      });
    }
    const { id } = request.params;
    const message = await Message.findByPk(id);

    if (!message) {
      return response.status(401).json({
        error: 'Erro ao editar mensagem, tente novamente',
      });
    }
    const { messages } = message.update(request.body);

    return response.json({
      id,
      messages,
    });
  }
}
export default new MessageController();

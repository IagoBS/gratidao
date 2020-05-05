import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Message from '../models/Message';

class MessageProviderController {
  async index(request, response) {
    const checktoUserProvider = await User.findOne({
      where: { id: request.userId, provider: true },
    });

    if (!checktoUserProvider) {
      return response.status(401).json({
        error: 'Erro ao mostrar mensagens, operação não autorizada',
      });
    }

    const { date } = request.query;
    const parseDate = parseISO(date);

    const message = await Message.findAll({
      where: {
        provider_id: request.userId,
        deleted_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: date,
    });

    return response.json(message);
  }
}
export default new MessageProviderController();

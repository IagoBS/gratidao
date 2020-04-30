import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (request, response, next) => {
  const authHearder = request.headers.authorization;

  if (!authHearder) {
    return response.status(403).json({
      error: 'Erro ao autenticar usuário tente novamente - Permissão negada',
    });
  }

  const [, token] = authHearder.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    request.userId = decoded.id;

    return next();
  } catch (err) {
    return response.status(401).json({
      error:
        'Erro na autenticação do usuário, tente novamente ou mais tarde - Tolken invalid',
    });
  }
};

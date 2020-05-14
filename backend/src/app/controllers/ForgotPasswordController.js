import * as Yup from 'yup';
import crypto from 'crypto';
import User from '../models/User';
import ForgotPassword from '../models/ForgotPassword';
import Queue from '../../lib/Queue';
import ForgotPasswordMail from '../jobs/ForgotPasswordMail';

class ForgotPasswordController {
  async store(request, response) {
    try {
      const shema = Yup.object().shape({
        email: Yup.string().email().required(),
      });

      if (!(await shema.isValid(request.body))) {
        return response.status(400).json({
          error: 'Erro ao cadastrar mensagem tente novamente - Bad Request',
        });
      }

      const { email } = request.body;

      const CheckUserExist = await User.findOne({
        where: { email },
      });

      if (!CheckUserExist) {
        return response.status(400).json({
          error: 'Erro ao encontrar e-mail desde usuário, tente novamente',
        });
      }

      const token = crypto.randomBytes(20).toString('hex');
      const nowDate = new Date();
      nowDate.setHours(nowDate.getHours() + 1);
      console.log(token, email, nowDate);

      const forgotpassword = await ForgotPassword.create({
        email,
        token_hash: token,
        token_created_at: nowDate,
      });

      await Queue.add(ForgotPasswordMail.key, {
        CheckUserExist,
        token,
        email,
      });

      return response.json(forgotpassword);
    } catch (err) {
      return response.status(400).json({
        error: `Erro na tentativa de recuperação de senha - tente novamente: ${err.message}`,
      });
    }
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        password: Yup.string()
          .min(6)
          .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required() : field
          ),
        confirmPassword: Yup.string().when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
      });

      if (!(await schema.isValid(request.body))) {
        return response.status(400).json({
          error: 'Erro ao cadastrar usuário tente novamente - validation fails',
        });
      }

      const checkToToken = await ForgotPassword.findOne({
        where: { token_hash: request.params.token },
      });
      if (!checkToToken) {
        return response
          .status(401)
          .json({ error: 'Erro ao encontrar usuário' });
      }

      const dateNow = new Date();

      if (dateNow > checkToToken.token_created_at) {
        return response.status(401).json({
          error: 'Erro ao mudar senha, tente novamente, o link expirou',
        });
      }

      const checkToUser = await User.findOne({
        where: { email: checkToToken.email },
      });

      const { password } = await checkToUser.update(request.body);

      return response.json(password);
    } catch (err) {
      return response.status(400).json({
        error: `Erro ao mudar senha, tente novamente: ${err.message}`,
      });
    }
  }
}

export default new ForgotPasswordController();

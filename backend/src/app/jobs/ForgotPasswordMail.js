import Mail from '../../lib/Mail';

class ForgotPasswordMail {
  get key() {
    return 'ForgotPasswordMail';
  }

  async handle({ data }) {
    const { CheckUserExist, token, email } = data;
    console.log('A fila executou');

    await Mail.sendMail({
      to: `${CheckUserExist.name} <${email}>`,
      subject: 'GRATIDÃO - SOLITAÇÃO PARA REDEFINIÇÃO DE SENHA',
      template: 'forgotpassword',
      context: {
        name: CheckUserExist.name,
        token,
      },
    });
  }
}
export default new ForgotPasswordMail();

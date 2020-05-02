import File from '../models/File';

class FileController {
  async store(request, response) {
    const fileFindExist = await File.findOne({
      where: { path: request.file.path },
    });

    if (fileFindExist) {
      return response.status(400).json({
        error: 'Erro ao fazer upload do arquivo tente novamente - Bad request',
      });
    }

    const { originalname: name, filename: path } = request.file;
    const file = await File.create({
      name,
      path,
    });
    return response.json(file);
  }
}
export default new FileController();

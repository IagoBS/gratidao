import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'images'),
    filename: (request, file, callback) => {
      crypto.randomBytes(8, (error, response) => {
        if (error) return callback(error);

        return callback(
          null,
          response.toString('hex') + extname(file.originalname)
        );
      });
    },
  }),
};

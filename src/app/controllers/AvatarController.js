import fs from 'fs';

import Courier from '../models/Courier';
import File from '../models/File';

class AvatarController {
  async update(req, res) {
    const { originalname, filename: path } = req.file;

    const courier = await Courier.findOne({
      where: {
        id: req.userId,
      },
    });

    const file = await File.findOne({
      where: {
        id: courier.avatar_id,
      },
    });

    const newFile = await File.create({
      name: originalname,
      path,
    });

    const { id, name, email } = await courier.update({
      avatar_id: newFile.id,
    });

    fs.unlink(`tmp/uploads/${file.path}`, (err) => {
      if (err) throw err;
    });

    return res.json({
      id,
      name,
      email,
      avatar: {
        id: newFile.id,
        name: newFile.name,
        path: newFile.path,
        url: newFile.url,
      },
    });
  }
}

export default new AvatarController();

import * as Yup from 'yup';
import fs from 'fs';
import Courier from '../models/Courier';
import File from '../models/File';

class CourierController {
  async store(req, res) {
    const { originalname, filename: path } = req.file;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      fs.unlink(`tmp/uploads/${path}`, (err) => {
        if (err) throw err;
      });
      return res.status(400).json({ error: 'Validation fails' });
    }

    const courierExists = await Courier.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (courierExists) {
      fs.unlink(`tmp/uploads/${path}`, (err) => {
        if (err) throw err;
      });
      return res.status(400).json({ error: 'Courier already exists' });
    }

    const file = await File.create({
      name: originalname,
      path,
    });

    const { id, name, email } = await Courier.create({
      name: req.body.name,
      email: req.body.email,
      avatar_id: file.id,
    });

    return res.json({
      id,
      name,
      email,
      avatar: {
        name: file.name,
        path: file.path,
        url: file.url,
      },
    });
  }

  async update(req, res) {
    const { name, email } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const courier = await Courier.findOne({
      where: {
        id: req.userId,
      },
    });

    if (email && email !== courier.email) {
      const userExists = await Courier.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    const { id } = await courier.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new CourierController();

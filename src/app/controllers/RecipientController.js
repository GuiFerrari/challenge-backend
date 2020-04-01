import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    if (req.userId !== 1) {
      return res
        .status(401)
        .json({ error: 'Only administrators can register recipients' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      uf: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      uf,
      city,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      address: {
        street,
        number,
        complement,
        uf,
        city,
        cep,
      },
    });
  }

  async update(req, res) {
    if (req.userId !== 1) {
      return res
        .status(401)
        .json({ error: 'Only administrators can update recipients' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      uf: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipent = await Recipient.findByPk(req.params.id);

    const {
      id,
      name,
      street,
      number,
      complement,
      uf,
      city,
      cep,
    } = await recipent.update(req.body);

    return res.json({
      id,
      name,
      address: {
        street,
        number,
        complement,
        uf,
        city,
        cep,
      },
    });
  }
}

export default new RecipientController();

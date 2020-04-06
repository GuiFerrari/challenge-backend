import * as Yup from 'yup';
import Order from '../models/Order';
import Courier from '../models/Courier';
import Recipient from '../models/Recipient';

import Mail from '../../lib/Mail';

class OrderController {
  async index(req, res) {
    const order = await Courier.findAll({
      order: ['created_at'],
    });
    return res.json(order);
  }

  async store(req, res) {
    const { recipient_id, courier_id, product } = req.body;

    const courier = await Courier.findByPk(courier_id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier does not exists' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      courier_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.create({
      recipient_id,
      courier_id,
      product,
    });

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: 'Teste Mail',
      template: 'order',
      context: {
        courier: courier.name,
        product,
        recipient: recipient.name,
      },
    });

    return res.json(order);
  }

  async delete(req, res) {
    const exists = await Order.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!exists) {
      return res.status(400).json({ error: 'Order not found' });
    }

    await Order.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.send();
  }
}

export default new OrderController();

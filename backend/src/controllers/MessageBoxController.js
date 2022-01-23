const moment = require('moment');

const MessageBoxModel = require('@/src/models/MessageBox');
const UserModel = require('@/src/models/User');
const InvestorModel = require('@/src/models/Investor');
const ConsultantModel = require('@/src/models/Consultant');
const MessageUserViewModel = require('@/src/models/MessageUserView');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');
const PaginationClass = require('@/src/class/Pagination');

module.exports = {

  async index(req, res) {

    try {
      const page = req.query.page || 1;
      const options = {};

      const Pagination = new PaginationClass(MessageBoxModel);
      const result = await Pagination.select(page, options);

      return res.json(Util.response(result));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result, 'Erro ao Deletar'));
    }

  },

  async get(req, res) {

    try {
      const { id } = req.params;

      const result = await MessageBoxModel.findByPk(id,  {
          include: {
            association: 'user_send', required: true
          },
          where : {
            id
          }
      });

      return res.json(Util.response(result));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  /** POST */

  async create(req, res) {

    const t = await MessageBoxModel.sequelize.transaction();

    try {

      const { id_user } = req.user;
      let user = await UserModel.findByPk(id_user);
      if (!user) throw new Exception("Usuário não existe");

      const campos = { ...req.body, id_user_send: id_user};

      const message = await MessageBoxModel.create(campos, { transaction: t });
      const result = { ...message.toJSON() };

      //=============
      //enviar msg
      let users;
      let key;
      switch (campos.to_group_user) {
        case 1:
          //investidores
          users = await InvestorModel.findAll();
          key = 'id_user';
          break;

        case 2:
          //consultores
          users = await ConsultantModel.findAll();
          key = 'id_user';
          break;

        default:
          //Todos
          users = await UserModel.findAll();
          key = 'id';
          break;
      }

      users = users.map((item) => {
        let id;

        if (key == 'id_user') id = item.id_user;
        else id = item.id;

        let out = { id_user: id, id_message_box: message.id };
        return out;
      });

      //console.log(users);

      await MessageUserViewModel.bulkCreate(users, { transaction: t });
      //=============

      await t.commit();

      return res.json(Util.response(result, 'Enviado com Sucesso'));

    } catch (e) {
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  async toUser(req, res) {

    const t = await MessageBoxModel.sequelize.transaction();

    try {

      const user_send = await UserModel.findByPk(req.user.id_user);
      if (!user_send) throw new Exception("Usuário não existe");

      const user = await UserModel.findByPk(req.params.id_user);
      if (!user) throw new Exception("Usuário não existe");

      const campos = { ...req.body, id_user_send: user_send.id};

      const message = await MessageBoxModel.create(campos, { transaction: t });
      const result = { ...message.toJSON() };

      await MessageUserViewModel.create({
        id_user: user.id,
        id_message_box: message.id
      }, { transaction: t });

      await t.commit();

      return res.json(Util.response(result, 'Enviado com Sucesso'));

    } catch (e) {
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  async setViewed(req, res) {

    try {

      const { id } = req.params

      const messageUserView = await MessageUserViewModel.findOne({
        where: {
          id_message_box: id,
          id_user: req.user.id_user
        }
      });

      // console.log('1', moment.locale());
      // console.log('2', moment().utc().format());
      // console.log('3', moment().utc().local().format());
      // console.log('4', moment().utc().local());
      // console.log('5', moment().local());

      /**
       * O banco de dados salva a hora como UTC!
       * Caso a hora seja necessaria, deve se converte o UTC para local
       *
       * moment(result.time_view).local().format();
      */
      let result = await messageUserView.update({
        viewed: (messageUserView.viewed) ? 0 : 1,
        time_view: (messageUserView.viewed) ? null :  moment()
      });
      result = result.toJSON();

      //devolvendo a hora certa
      if (result.time_view) {
        result.time_view = moment(result.time_view).local().format();
      }

      return res.json(Util.response(result));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  }

};

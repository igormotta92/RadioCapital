const { Op } = require('sequelize');

const UserController = require('@/src/controllers/UserController');

const InvestorModel = require('@/src/models/Investor');
const ConsultantModel = require('@/src/models/Consultant');

const file = require('@/src/utils/file');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');
const PaginationClass = require('@/src/class/Pagination');

module.exports = {
  async index(req, res) {
    try {
      let selFilter = req.query.search ? req.query.search : null;
      let wf = {};
      if (selFilter) {
        wf = {
          user: {
            where: {
              [Op.or]: [
                { name: { [Op.like]: `%${selFilter}%` } },
                { last_name: { [Op.like]: `%${selFilter}%` } },
              ],
            },
          },
        };
      }

      const page = req.query.page || 1;
      const options = {
        include: {
          association: 'user',
          required: true,
          ...wf.user,
          include: { association: 'profile' },
        },
      };

      const Pagination = new PaginationClass(ConsultantModel);
      const result = await Pagination.select(page, options);

      return res.json(Util.response(result));
    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  async get(req, res) {
    try {
      const { id } = req.params;
      const consultant = await ConsultantModel.findByPk(id, {
        include: {
          association: 'user',
          required: true,
          include: { association: 'profile' },
        },
      });

      if (!consultant) {
        if (!consultant)
          throw new Exception('Consultor não existe', 'id_consultant');
      }

      return res.json(consultant);
    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  /** Investors */

  async getInvestors(req, res) {
    try {
      const { id } = req.params;
      const consultant = await ConsultantModel.findByPk(id);

      if (!consultant) {
        if (!consultant)
          throw new Exception('Consultor não existe', 'id_consultant');
      }

      let selFilter = req.query.search ? req.query.search : null;

      let wf = {
        user: {
          where: {
            id_consultant: id,
          },
        },
      };

      if (selFilter) {
        wf.user.where = {
          ...wf.user.where,
          [Op.or]: [
            { name: { [Op.like]: `%${selFilter}%` } },
            { last_name: { [Op.like]: `%${selFilter}%` } },
          ],
        };
      }

      const page = req.query.page || 1;
      const options = {
        include: { association: 'user', required: true },
        ...wf.user,
      };

      const Pagination = new PaginationClass(InvestorModel);
      const onlyCount = req.query.onlyCount || null;
      if (onlyCount) {
        //só o total de registros
        result = await Pagination.count(options);
      } else {
        result = await Pagination.select(page, options);
      }

      return res.json(Util.response(result));
    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  /** POST */

  async create(req, res) {
    const t = await ConsultantModel.sequelize.transaction();

    try {
      const { ...bodyUser } = req.body;

      //----
      //User
      const user = await UserController.create({ bodyUser, file: req.file }, t);

      //----
      //Consultant
      const consultant = await ConsultantModel.create(
        {
          id_user: user.id,
        },
        { transaction: t }
      );

      const result = { ...consultant.toJSON(), user };

      //throw new Exception("Error Teste");

      await t.commit();

      return res.json(Util.response(result, 'Alterado com sucesso'));
    } catch (e) {
      if (req.file) await file.removeFile(`tmp/uploads/${req.file.filename}`);
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  async update(req, res) {
    const t = await ConsultantModel.sequelize.transaction();

    try {
      const { id } = req.params;
      let consultant = await ConsultantModel.findByPk(id);

      const { ...bodyUser } = req.body;

      //----
      //User
      const user = await UserController.update(
        consultant.id_user,
        { bodyUser, file: req.file },
        t
      );

      const result = {
        ...consultant.toJSON(),
        user,
      };

      //throw new Exception("Error Teste");

      await t.commit();

      return res.json(Util.response(result, 'Alterado com sucesso'));
    } catch (e) {
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  async delete(req, res) {
    const t = await ConsultantModel.sequelize.transaction();

    try {
      const { id } = req.params;
      let consultant = await ConsultantModel.findByPk(id);
      if (!consultant) throw new Exception('Consultor não existe');

      //----
      //User
      const user = await UserController.delete(consultant.id_user, t);

      const result = { ...consultant.toJSON(), user };

      //throw new Exception("Error Teste");

      await t.commit();

      return res.json(Util.response(result, 'Deletado com sucesso'));
    } catch (e) {
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result, 'Erro ao Deletar'));
    }
  },

  /** Outros*/
};

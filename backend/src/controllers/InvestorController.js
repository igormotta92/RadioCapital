const { Op } = require('sequelize');

const UserController = require('@/src/controllers/UserController');

const ImageModel = require('@/src/models/Image');
const UserModel = require('@/src/models/User');
const InvestorModel = require('@/src/models/Investor');
const ConsultantModel = require('@/src/models/Consultant');
const ContractModel = require('@/src/models/Contract');

const file = require('@/src/utils/file');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');
const PaginationClass = require('@/src/class/Pagination');

//Mover imagem
//https://nodejs.docow.com/451/como-faco-para-mover-arquivos-em-node-js.html

module.exports = {
  /** GET */

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
        include: [
          {
            association: 'user',
            required: true,
            ...wf.user,
            include: { association: 'profile' },
          },
          {
            association: 'consultant',
            include: { association: 'user' },
          },
          {
            association: 'contracts',
          },
        ],
      };

      const Pagination = new PaginationClass(InvestorModel);
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

      const result = await InvestorModel.findByPk(id, {
        include: [
          {
            association: 'user',
            required: true,
            include: { association: 'profile' },
          },
          {
            association: 'consultant',
            include: { association: 'user' },
          },
        ],
      });

      if (!result) {
        throw new Exception('Investidor não existe', 'id_investor');
      }

      return res.json(Util.response(result));
    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  /** Contracts */

  async createInvestorContract(req, res) {
    const t = await InvestorModel.sequelize.transaction();

    try {
      const bodyUser = {
        id_consultant: req.body.id_consultant,
        email: req.body.email,
        login: req.body.login,
        name: req.body.name,
        last_name: req.body.last_name,
        tel: req.body.tel,
        identif: req.body.identif,
      };

      //========================
      //Consultant
      const consultant = await ConsultantModel.findByPk(bodyUser.id_consultant);
      if (!consultant) {
        throw new Exception('Consultor não existe', 'id_consultant');
      }

      //========================
      //User
      const user = await UserController.create({ bodyUser, file: req.file }, t);

      //========================
      //Investor
      const investor = await InvestorModel.create(
        {
          id_user: user.id,
          id_consultant: bodyUser.id_consultant,
        },
        { transaction: t }
      );

      //========================
      //Contract

      const bodyContract = {
        begin: req.body.begin,
        day: req.body.day,
        time: req.body.time,
        value: req.body.value,
        id_investor: investor.id,
      };

      const contract = await ContractModel.create(bodyContract, {
        transaction: t,
      });

      //===================================

      const result = {
        ...investor.toJSON(),
        user,
        contract: { ...contract.toJSON() },
      };

      //===================================
      //mover imagem
      //await file.moveFile(`tmp/uploads/${req.file.filename}`, `attachments/${user.id}/${req.file.filename}`);

      //===================================
      //throw new Exception("Erro teste !!!");
      await t.commit();

      return res.json(Util.response(result, 'Inserido com Sucesso'));
    } catch (e) {
      if (req.file) await file.removeFile(`tmp/uploads/${req.file.filename}`);
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  async contracts(req, res) {
    try {
      const { id } = req.params;

      const investor = await InvestorModel.findByPk(id, {
        include: { association: 'user', required: true },
      });

      if (!investor) {
        throw new Exception('Investidor não existe', 'id_investor');
      }

      const page = req.query.page || 1;
      const options = {
        where: {
          id_investor: id,
        },
      };

      const Pagination = new PaginationClass(ContractModel);
      const result = await Pagination.select(page, options);

      return res.json(Util.response(result));
    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  /** POST */

  async create(req, res) {
    const t = await InvestorModel.sequelize.transaction();

    try {
      const { ...bodyUser } = req.body;

      //Consultant
      const consultant = await ConsultantModel.findByPk(bodyUser.id_consultant);
      if (!consultant) {
        throw new Exception('Consultor não existe', 'id_consultant');
      }

      //----
      //User
      const user = await UserController.create({ bodyUser, file: req.file }, t);

      //----
      //Consultant
      const investor = await InvestorModel.create(
        {
          id_consultant: bodyUser.id_consultant,
          id_user: user.id,
        },
        { transaction: t }
      );

      const result = { ...investor.toJSON(), user };

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
    const t = await InvestorModel.sequelize.transaction();

    try {
      const { id } = req.params;
      let investor = await InvestorModel.findByPk(id);

      const { id_consultant, ...bodyUser } = req.body;

      //----
      //Investor
      if (id_consultant) {
        const consultant = await ConsultantModel.findByPk(id_consultant);
        if (!consultant) {
          throw new Exception('Consultor não existe', 'id_consultant');
        }
        investor = await investor.update({ id_consultant }, { transaction: t });
      }

      //----
      //User
      const user = await UserController.update(
        investor.id_user,
        { bodyUser, file: req.file },
        t
      );

      const result = {
        ...investor.toJSON(),
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
    const t = await InvestorModel.sequelize.transaction();

    try {
      const { id } = req.params;
      let investor = await InvestorModel.findByPk(id);
      if (!investor) throw new Exception('Investidor não existe');

      //----
      //User
      const user = await UserController.delete(investor.id_user, t);

      const result = { ...investor.toJSON(), user };

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

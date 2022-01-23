const { Sequelize, Op } = require('sequelize');

const InvestorModel = require('@/src/models/Investor');
const ConsultantModel = require('@/src/models/Consultant');
const ContractModel = require('@/src/models/Contract');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');
const PaginationClass = require('@/src/class/Pagination');

module.exports = {
  /** GET */

  async pendingInvestor(req, res) {

    try {
      let selFilter = req.query.search ? req.query.search : null;
      let wf = {
        user: {
          where: {
            user_activated: 0,
          }
        }
      };

      if (selFilter) {
        wf.user.where = {
          ...wf.user.where,
          [Op.or]: [
            { name: { [Op.like]: `%${selFilter}%` } },
            { last_name: { [Op.like]: `%${selFilter}%` } },
          ],
        }
      }

      const pageSize = req.query.pageSize || null;

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

      const Pagination = new PaginationClass(InvestorModel, pageSize);
      let result = {};

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

  async pendingConsultants(req, res) {

    try {

      let selFilter = (req.query.search) ? req.query.search : null;
      let wf = {
        user: {
          where: {
            user_activated: 0,
          }
        }
      };

      if (selFilter) {
        wf.user.where = {
          ...wf.user.where,
          [Op.or]: [
            { name: { [Op.like]: `%${selFilter}%` } },
            { last_name: { [Op.like]: `%${selFilter}%` } },
          ],
        }
      }

      const pageSize = req.query.pageSize || null;
      const page = req.query.page || 1;
      const options = {
        include: {
          association: 'user',
          required: true,
          ...wf.user,
          include: { association: 'profile'}
        }
      };

      const Pagination = new PaginationClass(ConsultantModel, pageSize);
      let result = {};

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

  async pendingContracts(req, res) {

    try {

      let selFilter = (req.query.search) ? req.query.search : null;
      let wf = {
        contract: {
          where: {
            contract_activated: 0,
          }
        }
      };

      if (selFilter) {
        wf.contract.where = {
          ...wf.contract.where,
          [Op.or]: [
            { id: { [Op.like]: `%${parseInt(selFilter)}%` } },
            { value: { [Op.eq]: selFilter } },
            Sequelize.where(Sequelize.fn('date_format', Sequelize.col('begin'), '%d-%m-%Y'), 'like', `%${selFilter}%`),
          ]
        }
      }

      const pageSize = req.query.pageSize || null;
      const page = req.query.page || 1;
      const options = {
        include: [
          {
            association: 'investor',
            required: true,
            include : [
              {
                association: 'user',
                attributes: ['name', 'last_name', 'fullname', 'email'],
              },
              {
                association: 'consultant',
                include : {
                  association: 'user',
                  attributes: ['name', 'last_name', 'fullname', 'email'],
                },
              }
            ],
          }
        ],
        attributes: {
          include: [[Sequelize.fn('date_format', Sequelize.col('begin'), '%Y%m%d'), 'begin_order']]
        },
        ...wf.contract,
      };

      const Pagination = new PaginationClass(ContractModel, pageSize);
      let result = {};

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

};

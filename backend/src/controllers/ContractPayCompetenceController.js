const ContractModel = require('@/src/models/Contract');
const ContractPayCompetenceModel = require('@/src/models/ContractPayCompetence');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');
const PaginationClass = require('@/src/class/Pagination');

module.exports = {

  async index(req, res) {

    try {
      const page = req.query.page || 1;
      const options = {
        include: [
          { association: 'contract', required: true }
        ]
      };

      const Pagination = new PaginationClass(ContractPayCompetenceModel);
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
      const result = await ContractPayCompetenceModel.findByPk(id,  {
          include: [
              { association: 'contract', required: true }
          ]
      });

      if (!result) throw new Exception("Contrato não existe");

      return res.json(Util.response(result));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  /** Post */

  async update(req, res) {

    const t = await ContractPayCompetenceModel.sequelize.transaction();

    try {
      /** Validações */

      const { id } = req.params;

      let payCompetence = await ContractPayCompetenceModel.findByPk(id);
      if (!payCompetence) throw new Exception("Registro não existe");

      let contract = await ContractModel.findByPk(payCompetence.id_contract);
      if (!contract) throw new Exception("Contrato não existe", "id_contract");

      const { ...campos } = req.body

      payCompetence = await payCompetence.update(campos, { transaction: t });

      const result = {
        ...payCompetence.toJSON(),
      };

      await t.commit();

      return res.json(Util.response(result, 'Alterado com sucesso'));

    } catch (e) {
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  async delete(req, res) {

    const t = await ContractModel.sequelize.transaction();

    try {

      const { id } = req.params;

      let payCompetence = await ContractPayCompetenceModel.findByPk(id);
      if (!payCompetence) throw new Exception("Registro não existe");

      const result = await payCompetence.destroy({ transaction: t });

      await t.commit();

      return res.json(Util.response(result, 'Deletado com sucesso'));

    } catch (e) {
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result, 'Erro ao Deletar'));
    }

  },

};

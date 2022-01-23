const InvestorModel = require('@/src/models/Investor');
const ConsultantModel = require('@/src/models/Consultant');
const ContractModel = require('@/src/models/Contract');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');

module.exports = {
  async valid(req, res, next) {
    try {

      const { id } = req.params;
      const contract = await ContractModel.findByPk(id, {
        include: [
          {
            association: 'investor',
            required: true,
          }
        ]
      });
      if (!contract) {
        res.status(404)
        throw new Exception("Contrato não existe");
      }

      let hasRight = true;

      if (req.user.is_admin) {
        return next();

      } else if (req.user.type == 'consultant') {
        if (contract.investor.id_consultant != req.user.id ) {
          hasRight = false;
        }

      } else {
        if (contract.id_investor != req.user.id ) {
          hasRight = false;
        }

      }

      if (!hasRight) {
        res.status(403);
        throw new Exception("Você não tem direito de acesso");
      }

      return next();

    } catch (e) {
      const result = Exception._(e);
      return res.json(Util.response(result));
    }
  },

  async validCreate(req, res, next) {
    try {
      if (req.user.is_admin) return next();

      const { id_user } = req.user
      const consultant = await ConsultantModel.findOne({ where: { id_user } });
      if (!consultant) {
        res.status(403);
        throw new Exception("Você não tem direito para isso");
      }
      return next();

    } catch (e) {
      const result = Exception._(e);
      return res.json(Util.response(result));
    }
  }

}

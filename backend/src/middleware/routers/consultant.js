const InvestorModel = require('@/src/models/Investor');
const ConsultantModel = require('@/src/models/Consultant');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');

module.exports = {
  async valid(req, res, next) {
    try {
      const { id } = req.params;
      const consultant = await ConsultantModel.findByPk(id);
      if (!consultant) {
        res.status(404);
        throw new Exception("Consultor não existe");
      }

      if (consultant.id_user != req.user.id_user && !req.user.is_admin ) {
        res.status(403);
        throw new Exception("Você não tem direito de acesso");
      }
      return next();

    } catch (e) {
      const result = Exception._(e);
      return res.json(Util.response(result));
    }
  },

}

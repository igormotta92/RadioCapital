const InvestorModel = require('@/src/models/Investor');
const ConsultantModel = require('@/src/models/Consultant');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');

module.exports = {

  async validAttach(req, res, next) {
    try {

      if (!req.user && req.user.id_user) {
        res.status(403);
        throw new Exception('Você não tem direito de acesso');
      }
      return next();

    } catch (e) {
      const result = Exception._(e);
      return res.json(Util.response(result));
    }
  }

};

const UserModel = require('@/src/models/User');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');

module.exports = {
  async valid(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserModel.findByPk(id);
      if (!user) {
        res.status(404);
        throw new Exception("Usuário não existe");
      }

      if (id != req.user.id_user && !req.user.is_admin ) {
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

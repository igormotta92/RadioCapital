const MessageBoxModel = require('@/src/models/MessageBox');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');

module.exports = {
  async valid(req, res, next) {
    try {

      const { id } = req.params;

      const message = await MessageBoxModel.findByPk(id,  {where: {id}});
      if (!message) {
        res.status(404);
        throw new Exception("Mensagem não existe");
      }

      const messageUser = await MessageBoxModel.findByPk(id,  {
        include: {
          association: 'users',
          required: true,
          where: {
            id: req.user.id_user
          }
        },
        where : {
          id
        }
      });

      if (!messageUser && !req.user.is_admin ) {
        res.status(403)
        throw new Exception("Você não tem direito de acesso");
      }

      return next();

    } catch (e) {
      const result = Exception._(e);
      return res.json(Util.response(result));
    }
  },

}

const UserModel = require('@/src/models/Attachment');
const ImageModel =  require('@/src/models/Image');
const AttachmentModel = require('@/src/models/Attachment');
const CategoryAttachmentModel = require('@/src/models/CategoryAttachment');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');
const PaginationClass = require('@/src/class/Pagination');

const sFile = require('@/src/utils/file');

module.exports = {

  /**
   * @description Lista de anexos para validação
   */

  async attachmentsForValid(req, res) {

    try {

      const page = req.query.page || 1;
      const options = {
        include: [
          { association: 'user', required: true},
          { association: 'category_attachment', required: true},
          { association: 'image', required: true}
        ],
        where: { id_user_valid: null }
      };

      const Pagination = new PaginationClass(AttachmentModel, 9999);
      const result = await Pagination.select(page, options);

      return res.json(Util.response(result));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  /**
   * @description Anexar
   */

  async attach(req, res) {

    const t = await AttachmentModel.sequelize.transaction();
    //const { id_user } = req.params;
    const id_user = req.user.id_user;

    try {

      if (!req.file) throw new Exception('Nenhuma imagem enviada');

      const category = await CategoryAttachmentModel.findByPk(req.body.id_category);
      if (!category) throw new Exception('Categoria não existe');

      //========================
      //Image
      const image = await ImageModel.create(ImageModel.file2Image(req.file, id_user), { transaction: t });
      const attachment = await AttachmentModel.create({
        id_image: image.id,
        id_category_attachment: req.body.id_category,
        id_user,
        comment: req.body.comment,
      }, { transaction: t });

      await sFile.moveFile(
        `tmp/uploads/${req.file.filename}`,
        `attachments/${id_user}/${req.file.filename}`
      );

      const result = {
        ...attachment.toJSON(),
        image: { ...image.toJSON() },
        category: { ...category.toJSON() }
      }

      await t.commit();

      return res.json(Util.response({ result }, 'Anexado com sucesso'));

    } catch (e) {
      await sFile.removeFile(`tmp/uploads/${req.file.filename}`);
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  /**
   * @description Desanexar
   */

  async detach(req, res) {

    const t = await AttachmentModel.sequelize.transaction();
    const { id } = req.params;

    try {

      const attachment = await AttachmentModel.findByPk(id, {
        include: { association: 'image', required: true}
      });
      if (!attachment) throw new Exception('Anexo não existe');

      await attachment.destroy();
      await sFile.removeFile(
        `attachments/${attachment.id_user}/${attachment.image.key}`
      );

      await t.commit();

      const result = {
        ...attachment.toJSON()
      }

      return res.json(Util.response({ result }, 'Excluido com sucesso'));

    } catch (e) {
      await t.rollback();
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  /**
   * @description Validar anexo de um usuário
   */

  async toogleValidAttachment(req, res) {

    const { id } = req.params;

    try {

      const attachment = await AttachmentModel.findByPk(id);
      if (!attachment) throw new Exception('Anexo não existe');

      attachment.update({
        id_user_valid: (attachment.id_user_valid) ? null : req.user.id_user
      });

      const result = {
        ...attachment.toJSON()
      }

      return res.json(Util.response({ result }, 'Validado com sucesso'));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  }

};

const mailer = require("@/src/modules/mailer");

const UserModel = require('@/src/models/User');
const ContractModel = require('@/src/models/Contract');
const ImageModel =  require('@/src/models/Image');
const MessageBoxModel = require('@/src/models/MessageBox');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');
const PaginationClass = require('@/src/class/Pagination');

const Crypto = require("crypto");
const sFile = require('@/src/utils/file');

module.exports = {

  async index(req, res) {

    try {

      const page = req.query.page || 1;
      const options = {
        include: { association: 'profile'}
      };

      const Pagination = new PaginationClass(UserModel);
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
      const result = await UserModel.findByPk(id);

      if (!result) {
          return res.status(400).json({ error: 'Usuário não existe'} );
      }

      return res.json(Util.response(result));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  async getTokenResetPassword(req, res) {

    try {
      const { token } = req.params;
      const user = await UserModel.findOne({
        where: { password_reset_token: token  },
      });

      if (!user) {
          return res.status(400).json({ error: 'Usuário não existe 2'} );
      }

      return res.json(Util.response(user));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  async getMessages(req, res) {

    try {
      const { id } = req.params;
      let result = await MessageBoxModel.findAll({
          include: [
          {
            association: 'users',
            required: true,
            attributes: ['id', 'name'],
            through: {
              attributes: ['viewed', 'time_view'],
              where: {
                id_user: id
              }
            },
          },
          {
            association: 'user_send',
            required: true,
            attributes: ['id', 'name', 'last_name', 'email'],
            include: {
              association: 'profile',
              attributes: ['id', 'name', 'url'],
            }
          }
        ],
      },);

      if (!result) {
          //return res.status(400).json({ error: 'Usuário não existe'} );
          result = []
      }

      return res.json(Util.response(result));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  async toggleActive(req, res) {

    try {
      const { id } = req.params;
      let user = await UserModel.findByPk(id);

      await user.update({
        active: (!!user.active) ? 0 : 1,
      });

      return res.json(Util.response(
        user, `${(!!user.active) ? 'Ativado' : 'Desativado'} com Sucesso`
      ));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result, 'Erro ao Ativar usuário'));
    }

  },

  async toggleActivatedUser(req, res) {

    try {
      const { id } = req.params;
      let user = await UserModel.findByPk(id, {
        attributes: {
          include: ['password'],
        },
      });

      user.update({
        active: 1,
        user_activated: (!!user.user_activated) ? 0 : 1,
        user_activated_at: (!!user.user_activated) ? null : new Date(),
      });

      //-----------
      //Ativar contrato
      //Quando é um investidor novo é obrigatório ter um contrato
      let contract;
        contract = await ContractModel.findOne({
          include: [
            {
              association: 'investor',
              include: {
                  association: 'user',
                  where: {
                    id: user.id
                  }
                }
            }
          ]
        });

        if (contract) {
          contract.update({
            contract_activated: (!!contract.contract_activated) ? 0 : 1,
            contract_activated_at: (!!contract.contract_activated) ? null : new Date(),
          });
        }

      //-----------
      //Enviar e-mail
      if (!user.first_login_at && user.user_activated) {
        console.log('E-mail enviado');
        mailer.sendMail({
          to: user.email,
          template: 'login/warn_user_activated',
          context: {
            login: user.email,
            password: user.password,
            link: "http://xxxx.com.br"
          },
        }, (err) => {
          if (err)
            throw new Exception(`Erro ao enviar o email de usuário ativo. ${err.message}`);
        });
      }
      //-----------

      return res.json(Util.response({
          user,
          contract: (contract) ? { ...contract.toJSON() } : null
        },
         `${(!!user.user_activated) ? 'Ativado' : 'Desativado'} com Sucesso`
      ));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result, 'Erro ao Ativar usuário'));
    }

  },

  async alterPassword(req, res) {
    try {

      const { id } = req.params;
      const user = await UserModel.findByPk(id, {
        attributes: {
          include: ['password']
        }
      });
      //if (user) throw new Exception('Usuário não existe');

      const { password_old, password_new, password_new_confirm } = req.body;

      if (password_new !== password_new_confirm) {
        throw new Exception('Password novo e confirmação não são iguais');
      }

      if (user.validPassword(password_old)) {
        throw new Exception('Password novo é igual ao antigo');
      }

      await user.update({ password: password_old});

      //return res.json(Util.response(user.toJSON(['password'], 'e'), 'Senha alterada com sucesso'));
      return res.json(Util.response({}, 'Senha alterada com sucesso'));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result, 'Erro ao alterar senha'));
    }

  },

  /** Support Investor e Consultant */

  async create(body, t) {

    //========================
    //User
    const { bodyUser, file } = body;
    bodyUser.password = Crypto.randomBytes(5).toString('hex');
    let user = await UserModel.create({...bodyUser,}, { transaction: t });

    //========================
    //Image
    let image;
    if (file) {
      image = await ImageModel.create(ImageModel.file2Image(file, user.id), { transaction: t });
      await user.update({ id_image_profile: image.id }, { transaction: t });
      await sFile.moveFile(`tmp/uploads/${file.filename}`, `attachments/${user.id}/${file.filename}`);
    }

    user = user.toJSON(['password', 'updatedAt', 'createdAt'], "e");
    user.profile = (image) ? image.toJSON() : null;

    return user;
  },

  async update(id, body, t) {

    delete body.password;

    const { bodyUser, file } = body;

    let user = await UserModel.findByPk(id, {
      include: { association: 'profile'  }
    });

    user = await user.update({ ...bodyUser, }, { transaction: t });

    let image;
    switch (true) {
      case Boolean(!file && user.id_image_profile):
        //console.log('deleta image');
        image = await ImageModel.findByPk(user.id_image_profile);
        await image.destroy({ transaction: t });
        await sFile.removeFile(`attachments/${user.id}/${image.key}`);
        image = null;

        break;

      case Boolean((file && user.profile) && file.originalname == user.profile.name):
        //console.log('Apenas deleta tmp');
        await sFile.removeFile(`tmp/uploads/${file.filename}`);

        break;

      case Boolean((file && user.profile) && file.originalname !== user.profile.name):
        //console.log('atualiza image');
        let imageOLD = await ImageModel.findByPk(user.id_image_profile);
        await imageOLD.destroy({ transaction: t });
        await sFile.removeFile(`attachments/${user.id}/${imageOLD.key}`);
        //--
        image = await ImageModel.create(ImageModel.file2Image(file, user.id), { transaction: t });
        await user.update({ id_image_profile: image.id }, { transaction: t });
        await sFile.moveFile(`tmp/uploads/${file.filename}`, `attachments/${user.id}/${file.filename}`);
        break;

      case Boolean(file && !user.id_image_profile):
        //console.log('cria image');
        image = await ImageModel.create(ImageModel.file2Image(file, user.id), { transaction: t });
        await user.update({ id_image_profile: image.id }, { transaction: t });
        await sFile.moveFile(`tmp/uploads/${file.filename}`, `attachments/${user.id}/${file.filename}`);

        break;

      default:
        break;
    }

    user = user.toJSON(['password', 'updatedAt', 'createdAt'], "e");
    user.profile = (image) ? image.toJSON() : null;

    return user;
  },

  async delete(id, t) {

    let user = await UserModel.findByPk(id);
    if (!user) throw new Exception("Usuário não existe", "id_user");

    //const result = await investor.destroy({ transaction: t });
    user = await user.destroy({ transaction: t });

    //image
    const image = await ImageModel.findByPk(user.id_image_profile);
    if (image) {
      await image.destroy({ transaction: t });
      await sFile.removeFile(`attachments/${user.id}/${image.key}`);
    }

    user = user.toJSON()
    user.profile = (image) ? image.toJSON() : null;

    return user;
  }

};

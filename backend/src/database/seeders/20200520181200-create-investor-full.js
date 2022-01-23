'use strict';

const moment = require('moment');
const bcrypt = require('bcrypt');
const cpf = require("@fnando/cpf/commonjs");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {

      return new Promise(async (resolve, reject) => {
        try {

          let id_user;
          let id_consultant;
          let id_investor;
          let id_contract;

          for (var i = 0; i <= 5; i++) {

            //http://devfuria.com.br/javascript/numeros-aleatorios/
            //Como gerar um número randômico no “range” dos inteiros positivos (entre 0 e 65536):
            let key = Math.floor(Math.random() * 65536).toString();

            //---
            //Consultants
            id_user = await queryInterface.bulkInsert('users',
              [
                {
                  login: `consultant_${key}`,
                  email: `consultant_${key}@gmail.com`,
                  password: bcrypt.hashSync(key, bcrypt.genSaltSync(10)),
                  identif: cpf.generate(),
                  is_admin: (key % 2 === 0) ? true : false,
                  name: `Consultor_${key}`,
                  last_name: `Consultor_ln`,
                  tel: '219'+ Math.floor(10000000 + Math.random() * 9999999),
                  active: 1,
                  user_activated: 1,
                  user_activated_at: new Date(),
                  first_login_at: new Date(),
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              ], { transaction: t }
            );

            id_consultant = await queryInterface.bulkInsert('consultants',
              [
                {
                  id_user
                },
              ], { transaction: t }
            );

            //---
            //Investors
            id_user = await queryInterface.bulkInsert('users',
              [
                {
                  login: `investor_${key}`,
                  email: `investor_${key}@gmail.com`,
                  password: bcrypt.hashSync(key, bcrypt.genSaltSync(10)),
                  identif: cpf.generate(),
                  name: `Investidor_${key}`,
                  last_name: `Investidor_ln`,
                  tel: '219'+ Math.floor(10000000 + Math.random() * 9999999),
                  active: 1,
                  user_activated: 1,
                  user_activated_at: new Date(),
                  first_login_at: new Date(),
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              ], { transaction: t }
            );

            id_investor = await queryInterface.bulkInsert('investors',
              [
                {
                  id_user,
                  id_consultant
                },
              ], { transaction: t }
            );

            //---
            //Contracts
            id_contract = await queryInterface.bulkInsert('contracts',
              [
                {
                  id_investor,
                  begin: new Date(),
                  final: moment(new Date()).add(12, 'month').add(-1, 'day').format(),
                  day: 5,
                  time: '12',
                  value: 10000,
                  charging_rate: 10000 * 0.015,
                  contract_activated: 1,
                  contract_activated_at: new Date(),
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              ], { transaction: t }
            );

            if (i < 3) continue;

            //---
            //Contract_pay_competences
            await queryInterface.bulkInsert('contract_pay_competences',
              [
                {
                  id_contract,
                  value: '1000',
                  competence: '202005',
                  id_user_pay: id_user - 1,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              ], { transaction: t }
            );
          }
          resolve();

        } catch (error) {
          reject(error);
        }

      });
    })
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};


'use strict';

require('../../prototype/String');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {

      const categories = [
        'Identidade',
        'CPF',
        'Carteira de Motorista',
        'Carteira de Trabalho',
        'Comprovante de Residência'
      ];

      return new Promise((resolve, reject) => {
        try {

          categories.map(async category => {
            await queryInterface.bulkInsert('categories_attachment',
                [
                  {
                    category,
                    created_at: new Date(),
                    updated_at: new Date(),
                  },
                ], { transaction: t }
              );
          });

          resolve();

        } catch (error) {
          reject(error);
        }

      });
    })
  },

  down: (queryInterface) => queryInterface.bulkDelete('categories_attachment', null, {}),
};


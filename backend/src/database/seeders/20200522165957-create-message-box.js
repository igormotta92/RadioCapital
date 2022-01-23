'use strict';

// module.exports = {
//   up: (queryInterface, Sequelize) => queryInterface.bulkInsert('messages_box',
//     [
//       {
//         messagem: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//         id_administrator: 1,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     ], {}),

//   down: (queryInterface) => queryInterface.bulkDelete('messages_box', null, {}),
// };


//===

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {

      return new Promise(async (resolve, reject) => {
        try {

          let id_message = await queryInterface.bulkInsert('messages_box',
              [
                {
                  messagem: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
                  id_user_send: 2,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              ], { transaction: t }
            );

            await queryInterface.bulkInsert('message_user_view',
            [
              {
                id_message_box: id_message,
                id_user: 4,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ], { transaction: t }
          );


          resolve();

        } catch (error) {
          reject(error);
        }

      });
    })
  },

  down: (queryInterface) => queryInterface.bulkDelete('messages_box', null, {}),
};


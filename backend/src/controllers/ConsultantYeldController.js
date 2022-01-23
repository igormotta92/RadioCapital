const { Op } = require("sequelize");
const moment = require("moment");

//const UserModel = require('@/src/models/User');
const InvestorModel = require('@/src/models/Investor');
//const ConsultantModel = require('@/src/models/Consultant');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');

module.exports = {

  async getYield(req, res) {

    try {

      //===============================
      //Agrupando valores por mês e ano do investidores
      const { id, year } = req.params;

      const ini = moment(`${year}-01-01 00:00:00-00:00`);
      const fin = moment(`${year}-12-31 23:59:59-00:00`);

      //console.log(ini, fin);
      const investors = await InvestorModel.findAll({
        include: [
          {
            association: 'user',
            where: {
              [Op.and]: [
                { active: 1 },
                { user_activated: 1 }
              ]
            }
          },
          {
            association: 'contracts',
            where: {
              begin: {
                [Op.between]: [ini, fin]
              }
            }
          },
        ],
        where: {id_consultant: id}
      });

      //return res.json(Util.response(investors));

      //console.log(investors.length);
      const yeldInvestor = [];
      investors.map(investor => {
        //console.log(investor.toJSON());

        let {begin, value, final} = investor.contracts

        let ini = moment(begin);
        let fin = moment(final);
        //let fin = (break_contract) ? moment(break_contract): moment(begin).add(time, 'month')

        let yield = [];
        while (ini.format('YMM') <= fin.format('YMM')) {

          if (ini.year() > year) break;

          yield.push({
            year: ini.year(),
            month: ini.format('MM'),
            value,
            yield: value * 0.01
          });

          ini.add(1, 'month');
        }

        yeldInvestor.push({
          investor: investor.id,
          yields: yield
        });
      })
      //console.dir(yeldInvestor, { depth: null} );
      //===============================
      let aux = [];
      let total = 0;
      for (let i = 1; i <= 12; i++) {

        let month = i.toString().padStart(2, 0);

        //acumular valores dos investidores
        let value = 0;
        yeldInvestor.map((investor) => {
          let yield = investor.yields.filter((yield) => yield.month == month);
          if (yield.length) {
            value += yield[0].yield;
            total += yield[0].yield;
          }
        });

        aux.push({
          year,
          month,
          competence: `${month}/${year}`,
          value
        });
      }
      //console.dir(aux, { depth: null} );
      //console.log('total', total);
      //console.log(JSON.stringify(yeldInvestor, null, '\t'));

      return res.json(Util.response({ total, yield_year: aux }));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

  async getYieldMonthDetail(req, res) {

    try {

      //===============================
      //Agrupando valores por mês e ano do investidores
      const { id, year, month } = req.params;

      const ini = moment(`${year}-01-01 00:00:00-00:00`);
      const fin = moment(`${year}-12-31 23:59:59-00:00`);

      //console.log(ini, fin);
      const investors = await InvestorModel.findAll({
        include: [
          {
            association: 'user',
            where: {
              [Op.and]: [
                { active: 1 },
                { user_activated: 1 }
              ]
            }
          },
          {
            association: 'contracts',
            where: {
              begin: {
                [Op.between]: [ini, fin]
              }
            }
          }
        ],
        where: {id_consultant: id}
      });

      //return res.json(Util.response(investors));

      const yeldInvestor = [];
      let total = 0;
      investors.map(investor => {
        //console.log(investor.toJSON());

        let {begin, value, final} = investor.contracts
        let {name, last_name} = investor.user

        let ini = moment(begin);
        let fin = moment(final);
        //let fin = (break_contract) ? moment(break_contract): moment(begin).add(time, 'month')

        let yield = [];
        while (ini.format('YMM') <= fin.format('YMM')) {

          if (ini.year() > year) break;

          if (ini.format('MM') == month) {
            yield = {
              year: ini.year(),
              month: ini.format('MM'),
              yield: value * 0.01
            };
            total += yield.yield;
            break
          }

          ini.add(1, 'month');
        }

        yeldInvestor.push({
          investor: investor.id,
          name,
          last_name,
          full_name: `${name} ${last_name}`,
          contract_value: value,
          yields: yield
        });
      })
      //===============================

      return res.json(Util.response({ total, yield_investor: yeldInvestor }));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  },

};

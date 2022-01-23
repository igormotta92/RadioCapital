import moment from 'moment';
import convertCoinBr from '../../utils/convertCoinBr';

export default function calculateProjection(contract) {
  let { id, begin, final, value, time } = contract;

  let dt_begin = moment(begin);
  let dt_end = moment(final);
  //let dt_end = moment(begin).add(time, 'month');

  const aux = [];
  const months = [];
  const values = [];
  const rendimento = value * 0.1;
  while (dt_begin.format('YMM') <= dt_end.format('YMM')) {
    if (aux[aux.length - 1]) {
      value = aux[aux.length - 1].value + rendimento;
    }

    aux.push({
      year: dt_begin.get('year'),
      month: dt_begin.format('MM'),
      month_: dt_begin.format('MMMM').capitalize(),
      value,
      value_: convertCoinBr(value),
    });

    months.push(
      `${dt_begin.get('year')}/${dt_begin.format('MMM').capitalize()}`
    );
    values.push(value.toFixed(2));

    dt_begin.add(1, 'month');
  }

  //console.log(aux);

  return { id, time: aux, months, values, time };
}

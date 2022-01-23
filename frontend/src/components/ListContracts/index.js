import React from 'react';
import icon_cash from '../../assets/icon_cash.png';
import { Link } from 'react-router-dom';
import moment from 'moment';

import convertCoinBr from '../../utils/convertCoinBr';

export default function ListContracts(props) {
  const contracts = props.contracts;

  return (
    <div className="content-list-contract">
      <table className="list-contract">
        <thead>
          <tr>
            <th>Código</th>
            <th>Início</th>
            {/* <th>Final</th> */}
            <th>
              <img src={icon_cash} alt="icon_cash" />
            </th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => {
            let con = {
              id: contract.id.toString().padStart('5', '0'),
              begin: moment(contract.begin).format('L'),
              end: moment(contract.begin)
                .add(contract.time, 'months')
                .format('L'),
              value: convertCoinBr(contract.value),
            };
            return (
              <tr key={con.id}>
                <td>
                  <Link to={`/detail-contract/${contract.id}`}>
                    <p>{con.id}</p>
                  </Link>
                </td>
                <td>
                  <p>{con.begin}</p>
                </td>
                {/* <td><p>{con.end}</p></td> */}
                <td>
                  <p>{con.value}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

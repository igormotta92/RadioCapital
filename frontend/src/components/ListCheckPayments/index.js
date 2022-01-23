import React from 'react';
//import icon_cash from '../../assets/icon_cash.png'
//import {Link} from 'react-router-dom';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import convertCoinBr from '../../utils/convertCoinBr';
import Swal from 'sweetalert2';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { payMonthContract } from '../../controller/Adm';

const PayOut = (props) => {
  async function handlePayMonth(data) {
    props.handleSetResetPage(false);
    Swal.fire({
      title: 'Cadastrar pagamento',
      text:
        'Tem certeza que deseja cadastrar como pago o valor de ' +
        convertCoinBr((props.contractValue * 10) / 100) +
        ' referente a ' +
        props.comp +
        ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      camceçButtonText: 'Não',
      confirmButtonText: 'Sim!',
      background: '#121212',
    }).then(async (result) => {
      if (result.value) {
        const returnMessageApi = await payMonthContract(props.contractId, data);
        if (returnMessageApi.hasOwnProperty('response')) {
          Swal.fire({
            title: 'Erro!',
            text: returnMessageApi.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
            background: '#121212',
            confirmButtonColor: '#a0770a',
          });
        } else {
          Swal.fire({
            title: 'Sucesso',
            text: 'Cadastro de pagamento realizado com sucesso',
            icon: 'success',
            confirmButtonText: 'OK',
            background: '#121212',
            confirmButtonColor: '#a0770a',
          });
          props.handleSetResetPage(true);
        }
      }
    });
  }
  return (
    <ul style={{ padding: '8px 10px' }}>
      <li className="text-white">{props.comp}</li>
      <li className="text-beige">{convertCoinBr(props.value)}</li>

      <li>
        {props.payOut !== 1 && props.isAdm === true ? (
          <LocalAtmIcon
            style={{ color: '#25C00C', marginRight: '2px' }}
            onClick={(e) =>
              handlePayMonth({
                value: (props.contractValue * 10) / 100,
                competence: props.competence,
              })
            }
          />
        ) : (
          ''
        )}
        {props.payOut === 1 ? (
          <CheckCircle style={{ color: '#25C00C' }} />
        ) : (
          <RemoveCircleIcon style={{ color: '#2E2E2E' }} />
        )}
      </li>
    </ul>
  );
};

export default function ListContracts(props) {
  return (
    <div className="list-check-payments">
      {props.payMonths.map((payMonth, key) => (
        <div key={key}>
          <PayOut
            payOut={payMonth.pay}
            value={payMonth.value}
            comp={payMonth.competence_}
            isAdm={props.isAdm}
            contractId={props.contractId}
            competence={payMonth.competence}
            contractValue={props.contractValue}
            handleSetResetPage={props.handleSetResetPage}
          />
        </div>
      ))}
    </div>
  );
}

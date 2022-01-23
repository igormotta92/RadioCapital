//Essa rota e responsavel por editar e criar , contratos,investidores e consultores.
import React, { useState } from 'react';
import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';
import api from '../../../services/api';
import { createUserInvestor, editUser } from '../../../controller/user';
import { useAuthContext } from '../../../Context/AuthContext';
import './styles.css';
//import AlertPopUp from '../../components/AlertPopUp';
import Swal from 'sweetalert2';
//masks
import {
  cpfMask,
  maskTel,
  durationContractMask,
} from '../../../utils/maskInputs';

//--------------------------------------
import IntlCurrencyInput from 'react-intl-currency-input';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

const currencyConfig = {
  locale: 'pt-BR',
  formats: {
    number: {
      BRL: {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

export default function EditContract(props) {
  //Variavel que fara o controle de criação de usuario ou consultor
  //console.log(props.location);
  const contract = props.location.state.contract;
  const userId = props.location.state.userId;
  //const history = useHistory();

  //const { user } = useAuthContext();
  //console.log(user);

  const [valueInvest, setValueInvest] = useState(0);
  const [startContract, setStartContract] = useState('');
  const [endContract, setEndContract] = useState('');
  const [timeContract, setTimeContract] = useState('');

  const handlevalueInvestInput = (event, value, maskedValue) => {
    event.preventDefault();
    setValueInvest(value); // value without mask (ex: 1234.56)
  };

  useEffect(() => {
    setValueInvest(Number(contract.value));
    setStartContract(contract.begin.substring(0, 10));
    setEndContract(contract.final.substring(0, 10));
    setTimeContract(String(contract.time));
  }, []);
  //console.log(contract);
  //console.log(userId);
  async function handleEditContract(e) {
    e.preventDefault();
    const dataForm = {
      begin: startContract,
      final: endContract,
      day: 5,
      time: timeContract.replace(/[ ]|[meses]/g, ''),
      value: valueInvest,
      id_investor: userId,
    };

    try {
      const result = await api.put('/contracts/' + contract.id, dataForm);

      if (result) {
        let contract = result.data.data;
        //console.log(contract);
        setValueInvest(Number(contract.value));
        setStartContract(contract.begin.substring(0, 10));
        setEndContract(contract.final.substring(0, 10));
        setTimeContract(String(contract.time));
      }

      Swal.fire({
        title: 'Sucesso',
        text: 'Contrato alterado com sucesso ',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#121212',
        confirmButtonColor: '#a0770a',
      });
    } catch (error) {
      console.log(error.respose);
      Swal.fire({
        title: 'Erro!',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#121212',
        confirmButtonColor: '#a0770a',
      });
    }
  }

  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-contract-edit">
        <div className="content-form">
          <form onSubmit={handleEditContract}>
            <div className="inputs-contracts">
              <h1>Editar Contrato</h1>
              <p className="text-white">Status: {contract.xstatus}</p>
              <p className="text-white">
                COD:{String(contract.id).padStart(5, '0')}
              </p>
              <div className="edit-form">
                <label htmlFor="valueInvest" className="label">
                  Valor Investido *
                </label>

                <IntlCurrencyInput
                  id="valueInvest"
                  currency="BRL"
                  config={currencyConfig}
                  onChange={handlevalueInvestInput}
                  value={valueInvest}
                  required
                  disabled={['vigente', 'encerrado'].includes(contract.xstatus)}
                />
              </div>

              <div className="edit-form">
                <label htmlFor="startContract" className="label">
                  Incio do contrato *
                </label>
                <input
                  type="date"
                  id="startContract"
                  value={startContract}
                  onChange={(e) => setStartContract(e.target.value)}
                  required
                  disabled={['vigente', 'encerrado'].includes(contract.xstatus)}
                />
              </div>

              <div className="edit-form">
                <label htmlFor="handleTimeContract" className="label">
                  Duração do contrato *
                </label>
                <input
                  type="text"
                  id="doneCohandleTimeContractntract"
                  value={timeContract}
                  onChange={(e) =>
                    setTimeContract(durationContractMask(e.target.value))
                  }
                  required
                  disabled={['vigente', 'encerrado'].includes(contract.xstatus)}
                />
              </div>

              <div className="edit-form">
                <label htmlFor="startContract" className="label">
                  Final do contrato *
                </label>
                <input
                  type="date"
                  id="endContract"
                  value={endContract}
                  onChange={(e) => setEndContract(e.target.value)}
                  required
                  disabled={
                    !['vigente', 'encerrado'].includes(contract.xstatus)
                  }
                />
              </div>
            </div>
            <button style={{ padding: '10px 90px', marginTop: '30px' }}>
              SALVAR
            </button>
          </form>
        </div>
      </main>

      <FooterBackground notLogin={true} notBack={true} />
    </Container>
  );
}

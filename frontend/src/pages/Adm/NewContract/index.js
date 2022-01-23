//Essa rota e responsavel por editar e criar , contratos,investidores e consultores.
//o css dessa pagina se encontra no css da pagina viewProfile
import React, { useState } from 'react';
import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';
import Checkbox from '@material-ui/core/Checkbox';
import SelectListPopUp from '../../../components/SelectListPopUp';

import {
  createUserInvestor,
  createUserConsultant,
  editUser,
} from '../../../controller/user';
import { useAuthContext } from '../../../Context/AuthContext';

//import AlertPopUp from '../../components/AlertPopUp';
import Swal from 'sweetalert2';
//masks
import { durationContractMask } from '../../../utils/maskInputs';

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
//-------------------------------------
const Contract = (props) => {
  const [controlValueInputInvestor, setControlValueInputInvestor] = useState(0);

  const handlevalueInvestInput = (event, value, maskedValue) => {
    event.preventDefault();
    props.handlevalueInvest(value); // value without mask (ex: 1234.56)
  };

  function handleSelectInvestor() {
    setControlValueInputInvestor(1);
  }

  useEffect(() => () => '', [controlValueInputInvestor]);

  return (
    <div className="inputs-contracts">
      <div className="edit-form">
        <label htmlFor="valueInvest" className="label">
          Valor Investido *
        </label>

        <IntlCurrencyInput
          id="valueInvest"
          currency="BRL"
          config={currencyConfig}
          onChange={handlevalueInvestInput}
          required
        />
      </div>

      <div className="edit-form">
        <label htmlFor="startContract" className="label">
          Incio do contrato *
        </label>
        <input
          type="date"
          id="startContract"
          value={props.startContract}
          onChange={(e) => props.handleStartContract(e.target.value)}
          required
        />
      </div>

      <div className="edit-form">
        <label htmlFor="handleTimeContract" className="label">
          Duração do contrato *
        </label>
        <input
          type="text"
          id="doneCohandleTimeContractntract"
          value={props.timeContract}
          onChange={(e) =>
            props.handleTimeContract(durationContractMask(e.target.value))
          }
          required
        />
      </div>
      <div className="edit-form">
        <label htmlFor="handleTimeContract" className="label">
          Investidor*
        </label>
        <input
          type="text"
          id="doneCohandleTimeContractntract"
          value={props.timeContract}
          placeholder="Selecione o investidor"
          onChange={(e) =>
            props.handleTimeContract(durationContractMask(e.target.value))
          }
          onClick={(e) => handleSelectInvestor()}
          required
          readOnly={true}
        />
        {controlValueInputInvestor === 0 && <SelectListPopUp />}
      </div>
    </div>
  );
};

export default function NewContract(props) {
  //Variavel que fara o controle de criação de usuario ou consultor

  const newUser = props.location.state;
  const history = useHistory();

  const { user } = useAuthContext();

  const [idInvestidor, setIdInvestidor] = useState(0);
  const [valueInvest, setValueInvest] = useState(0);
  const [startContract, setStartContract] = useState('');
  const [timeContract, setTimeContract] = useState('');

  //Função para tratar a requisição que será feita de um novo usuário.
  async function handleNewUser(e) {
    e.preventDefault();

    let returnMessage = '';
    //Caso seja uma ação de PUT de um user é necessário criar um formdata
    if (newUser.isEdit === true) {
      let formData = new FormData();
      returnMessage = await editUser(formData, newUser.userId, newUser.type);
    } else {
      let data = {
        // login: name,

        begin: startContract,
        time: timeContract.replace(/[ ]|[meses]/g, ''),
        value: valueInvest,
        day: 5, //O dia foi setado no dia 5 pois eles so fazem pagamento mes 5
        final: '',
      };

      returnMessage = await createUserInvestor(data);
    }

    //se requisição falahar
    if (returnMessage.hasOwnProperty('response')) {
      Swal.fire({
        title: 'Erro!',
        text: returnMessage.response.data.message,
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#121212',
        confirmButtonColor: '#a0770a',
      });
    } else {
      Swal.fire({
        title: 'Sucesso',
        text: returnMessage,
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#121212',
        confirmButtonColor: '#a0770a',
      });
      if (newUser.type === 'consultant') {
        history.push('/consultants');
      } else {
        history.push('/investors');
      }
    }
  }
  useEffect(() => {
    function fillInputFormEdit() {}
    if (newUser.user) {
      fillInputFormEdit();
    }
  }, [newUser]);

  return (
    <Container className="container-login">
      <HeaderBackground notLogin={true} />
      <main className="main-myprofile">
        <div className="title-header">
          <h1>{newUser.isEdit ? 'Editar' : 'Cadastrar'} Contrato</h1>
        </div>

        <div className="content-form">
          <form onSubmit={handleNewUser}>
            <Contract
              valueInvest={valueInvest}
              handlevalueInvest={setValueInvest}
              startContract={startContract}
              handleStartContract={setStartContract}
              timeContract={timeContract}
              handleTimeContract={setTimeContract}
            />

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

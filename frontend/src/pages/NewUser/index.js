//Essa rota e responsavel por editar e criar , contratos,investidores e consultores.
//o css dessa pagina se encontra no css da pagina viewProfile
import React, { useState } from 'react';
import Container from '../../components/Container';
import HeaderBackground from '../../components/HeaderBackground';
import FooterBackground from '../../components/FooterBackground';
import Checkbox from '@material-ui/core/Checkbox';

import {
  createUserInvestor,
  createUserConsultant,
  editUser,
} from '../../controller/user';
import { useAuthContext } from '../../Context/AuthContext';

//import AlertPopUp from '../../components/AlertPopUp';
import Swal from 'sweetalert2';
//masks
import { cpfMask, maskTel, durationContractMask } from '../../utils/maskInputs';

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
  const handlevalueInvestInput = (event, value, maskedValue) => {
    event.preventDefault();
    props.handlevalueInvest(value); // value without mask (ex: 1234.56)
  };

  return (
    <div className="inputs-contracts">
      <h3 style={{ margin: '28px auto' }}>Cadastrar Contrato</h3>
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
    </div>
  );
};

export default function NewUser(props) {
  //Variavel que fara o controle de criação de usuario ou consultor
  // console.log(props.location);
  const newUser = props.location.state;
  const history = useHistory();

  const { user } = useAuthContext();
  //console.log(user);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cpf, setCpf] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');

  const [adminCheck, setAdminCheck] = useState(0);

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
      formData.append('name', name);
      formData.append('last_name', lastName);
      formData.append('cpf', cpf.replace(/[.-]/g, ''));
      formData.append('tel', tel.replace(/[()-]/g, ''));
      formData.append('email', email);
      returnMessage = await editUser(formData, newUser.userId, newUser.type);
    } else {
      let data = {
        // login: name,
        email,
        name,
        last_name: lastName,
        tel: tel.replace(/[()-]/g, ''),
        id_consultant: user.id,
        identif: cpf.replace(/[.-]/g, ''),
        begin: startContract,
        time: timeContract.replace(/[ ]|[meses]/g, ''),
        value: valueInvest,
        day: 5, //O dia foi setado no dia 5 pois eles so fazem pagamento mes 5
        final: '',
      };
      if (newUser.type === 'consultant') {
        data = { ...data, is_admin: adminCheck };
        returnMessage = await createUserConsultant(data);
      } else {
        returnMessage = await createUserInvestor(data);
      }
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
    function fillInputFormEdit() {
      setName(newUser.user.name);
      setLastName(newUser.user.last_name);
      setCpf(cpfMask(newUser.user.identif));
      setTel(maskTel(newUser.user.tel));
      setEmail(newUser.user.email);
    }
    if (newUser.user) {
      fillInputFormEdit();
    }
  }, [newUser]);

  return (
    <Container className="container-login">
      <HeaderBackground notLogin={true} />
      <main className="main-myprofile">
        <div className="title-header">
          {newUser.type === 'investor' ? (
            <h1>{newUser.isEdit ? 'Editar' : 'Cadastro'} Investidor</h1>
          ) : (
            <h1>{newUser.isEdit ? 'Editar' : 'Cadastro'} Consultor</h1>
          )}
        </div>

        <div className="content-form">
          <form onSubmit={handleNewUser}>
            <div className="edit-form">
              <label htmlFor="nome" className="label">
                Nome *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="edit-form">
              <label htmlFor="sobreNome" className="label">
                Sobrenome *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="edit-form">
              <label htmlFor="sobreNome" className="label">
                CPF *
              </label>
              <input
                maxLength="14"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(cpfMask(e.target.value))}
                required
              />
            </div>

            <div className="edit-form">
              <label htmlFor="tel" className="label">
                Telefone *
              </label>
              <input
                id="tel"
                type="tel"
                value={tel}
                onChange={() => {}}
                placeholder="(21) xxxxx-xxxx"
                onInput={(e) => setTel(maskTel(e.target.value))}
                required
              />
            </div>
            <div className="edit-form">
              <label htmlFor="email" className="label">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {newUser.type === 'consultant' && newUser.isEdit === false && (
              <div className="edit-form-check">
                <label htmlFor="isAdmin" className="isAdmin">
                  Usuário Administrador
                </label>
                <Checkbox
                  checked={adminCheck}
                  onChange={(e) => setAdminCheck(e.target.checked)}
                  color={'default'}
                  inputProps={{ 'aria-label': 'checkbox with default color' }}
                />
              </div>
            )}

            {newUser.type === 'investor' && newUser.isEdit === false ? (
              <Contract
                valueInvest={valueInvest}
                handlevalueInvest={setValueInvest}
                startContract={startContract}
                handleStartContract={setStartContract}
                timeContract={timeContract}
                handleTimeContract={setTimeContract}
              />
            ) : (
              ''
            )}

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

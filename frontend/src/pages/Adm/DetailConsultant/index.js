import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';
import { deleteUser, statusUser } from '../../../controller/user';
import { sendMessage } from '../../../controller/Adm';

import { Link } from 'react-router-dom';
import { AllAssoatedinvestors } from '../../../controller/Consultant';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import { cpfMask, maskTel } from '../../../utils/maskInputs';
import Swal from 'sweetalert2';
import List from '../../../components/List';
import Alert from '../../../components/Alert';

import { useAuthContext } from '../../../Context/AuthContext';

import './styles.css';

//------------------------------------------------------------

export default function DetailInvestment(props) {
  const history = useHistory();
  const { user } = useAuthContext();
  const [consultant, setConsultant] = useState([]);
  const [userId, setUserId] = useState(''); //Id da tabela do consultor
  const [investorsAssociated, setInvestorsAssociated] = useState([]);

  useEffect(() => {
    async function requestGetconsultantAssciated() {
      const dataconsultant = props.location.state.stateLink;

      setConsultant(dataconsultant.user);
      setUserId(dataconsultant.id);

      const dataInvestorsAssociated = await AllAssoatedinvestors(
        dataconsultant.id
      );
      setInvestorsAssociated(dataInvestorsAssociated.rows);
    }
    setTimeout(() => {
      requestGetconsultantAssciated();
    }, 500);
  }, [props.location.state.stateLink, props.location.state.stateLink.id]);

  async function handlleDelete() {
    Swal.fire({
      title: 'Deletar',
      text:
        'Tem certeza que deseja deletar o investidor ' +
        consultant.name +
        ' ' +
        consultant.last_name +
        ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      camceçButtonText: 'Não',
      confirmButtonText: 'Sim, quero deletar!',
      background: '#121212',
    }).then(async (result) => {
      if (result.value) {
        const returnMessageApi = await deleteUser(userId, 'consultant');
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
            text: returnMessageApi,
            icon: 'success',
            confirmButtonText: 'OK',
            background: '#121212',
            confirmButtonColor: '#a0770a',
          });
          history.push('/consultants');
        }
      }
    });
  }

  async function handlleStatus(newUser) {
    const returnMessageApi = await statusUser(consultant.id, newUser);
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
        text: returnMessageApi.data.message,
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#121212',
        confirmButtonColor: '#a0770a',
      });
    }

    setConsultant({ ...consultant, active: consultant.active == 1 ? 0 : 1 });
  }

  async function handleSendMessage() {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      title: 'Enviar mensagem para ' + consultant.name,
      inputPlaceholder: 'Escreva sua mensagem aqui',
      inputAttributes: {
        'aria-label': 'Escreva sua mensagem aqui',
      },
      showCancelButton: true,
      background: '#121212',
    });

    if (text) {
      Swal.fire({
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        camceçButtonText: 'Não',
        confirmButtonText: 'Enviar, mensagem!',
        background: '#121212',
      }).then(async (result) => {
        if (result.value) {
          const returnMessageApi = await sendMessage(consultant.id, text);
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
              text: 'Mensagem enviada',
              icon: 'success',
              confirmButtonText: 'OK',
              background: '#121212',
              confirmButtonColor: '#a0770a',
            });
            //history.push('/consultants');
          }
        }
      });
    }
  }

  let tel = consultant.tel ? consultant.tel : 0;
  tel = parseInt(tel);

  //INICIO DO COMPONENTE----------------------------------------------------------------------------
  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-ivestors">
        <div className="title-header">
          <h1 className="h1">Consultor</h1>

          {user.is_admin === 1 && (
            <div className="button-controler-user">
              <Link
                to={{
                  pathname: '/newUser',
                  state: {
                    user: consultant,
                    userId,
                    type: 'consultant',
                    isEdit: true,
                  },
                }}
              >
                {' '}
                <EditIcon
                  title="Editar"
                  style={{
                    backgroundColor: ' #a0770a',
                    padding: '2px',
                    borderRadius: '5px',
                    boxShadow: 'var(--shadow-bottom)',
                    color: 'white',
                  }}
                />
              </Link>

              <>
                {' '}
                {consultant.active === 0 ? (
                  <CheckIcon
                    onClick={(e) =>
                      handlleStatus(
                        (consultant.active === 0) &
                          (consultant.user_activated === 0)
                          ? true
                          : false
                      )
                    }
                    style={{
                      margin: '0px 5px',
                      backgroundColor: 'green',
                      padding: '2px',
                      borderRadius: '5px',
                      boxShadow: 'var(--shadow-bottom)',
                      color: 'white',
                    }}
                    title="Ativar"
                    alt="Ativar"
                  />
                ) : (
                  <HighlightOffIcon
                    onClick={(e) => handlleStatus(false)}
                    style={{
                      margin: '0px 5px',
                      backgroundColor: ' #a0770a',
                      padding: '2px',
                      borderRadius: '5px',
                      boxShadow: 'var(--shadow-bottom)',
                      color: 'white',
                    }}
                    title="Desativar"
                  />
                )}
              </>

              <DeleteIcon
                onClick={(e) => handlleDelete()}
                style={{
                  backgroundColor: 'red',
                  padding: '2px',
                  borderRadius: '5px',
                  boxShadow: 'var(--shadow-bottom)',
                  cursor: 'pointer',
                  color: 'white',
                }}
                title="Excluir"
              />
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <p className="name_user">
            {' '}
            &nbsp;{consultant.name}&nbsp;{consultant.last_name}
          </p>
          {user.is_admin === 1 &&
            (consultant.active === 1 ? (
              <span className="tag-active">ativo</span>
            ) : (
              <span className="tag-disabled">desativado</span>
            ))}
        </div>

        <div className="content-detail-consultant">
          <div className="detail-consultant">
            <p className="weight-thin">
              Cpf:{' '}
              <b className="text-white">
                {cpfMask(String(consultant.identif))}
              </b>
            </p>
            <p className="weight-thin">
              Telefone: <b className="text-white">{maskTel(tel.toString())}</b>
            </p>
            <p styled={{ marginTop: '10px' }} className="weight-thin">
              E-mail: <b className="text-white">{consultant.email}</b>
            </p>
            {user.is_admin === 1 && (
              <div className="action-button-detail">
                <div className="enviar-mensage">
                  <button onClick={(e) => handleSendMessage()}>
                    Enviar Mensagem
                  </button>
                </div>
                <div className="projection">
                  <Link to={`/incomeConsultant/${userId}`}>
                    <button>Projeção</button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="content-investor-associated">
            <h3>Investidores Associados</h3>
            <div className="list" style={{ margin: '20px 0px' }}>
              {investorsAssociated.length === 0 && (
                <Alert>Não possui associados</Alert>
              )}
              {investorsAssociated.map((investor, key) => (
                <List
                  key={key}
                  value_col_1={`${investor.user.name} ${investor.user.last_name}`}
                  url={`/detailInvestor/${investor.user.name}`}
                  stateLink={investor}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <FooterBackground
        notLogin={true}
        notBack={true}
        backPage={'/consultants'}
      />
    </Container>
  );
}

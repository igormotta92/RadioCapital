import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';

import {
  getAllInvestors,
  getAllConsultants,
  getAllContracts,
} from '../../../controller/Adm';
import { AllAssoatedinvestors } from '../../../controller/Consultant';
// import api from '../../services/api';

import './styles.css';

//------------------------------------------------------------
import { useAuthContext } from '../../../Context/AuthContext';

export default function AdmProfile() {
  const { user } = useAuthContext();
  let count = 0;

  const [totInvestors, setTotInvestors] = useState(0);
  const [totConsultants, setTotConsultants] = useState(0);
  const [totInvestorAssociated, setTotInvestorAssociated] = useState(0);
  const [totalContracts, setTotalContracts] = useState([]); //Contratos Pendentes
  const [totalPendencies, setTotalPendencies] = useState('');
  //const [totalPendencies, setTotalPendencies] = useState(0);

  const [investors, setInvestors] = useState([]); //Investidores pendentes
  const [consultants, setConsultants] = useState([]); //Consultores Pendentes
  const [contracts, setContracts] = useState([]); //Consultores Pendentes

  useEffect(() => {
    // Create an scoped async function in the hook
    async function getTotals() {
      const datai = await getAllInvestors(true);
      setTotInvestors(datai.totreg);

      const datac = await getAllConsultants(true);
      setTotConsultants(datac.totreg);

      const datainvestorA = await AllAssoatedinvestors(user.id);
      setTotInvestorAssociated(datainvestorA.totreg);

      const dataContracts = await getAllContracts();
      setTotalContracts(dataContracts.totreg);

      //console.log(datai, datac, datainvestorA, dataContracts);

      count += getPendenciasInvestors(datai.rows);
      count += getPendenciasConsultants(datac.rows);
      count += getPendenciasContracts(dataContracts.rows);

      setTotalPendencies(count);
      //Sum evidencias
    }

    getTotals();
  }, []);

  //Filtra investidores desativados
  function getPendenciasInvestors(rows) {
    //rows = [];
    const pendencies = rows.filter((investor) => {
      return investor.user.user_activated === 0;
    });
    setInvestors(pendencies);
    return pendencies.length;
  }

  //Filtra Consultores Desativados
  function getPendenciasConsultants(rows) {
    //rows = [];
    const pendencies = rows.filter((consultant) => {
      return consultant.user.user_activated === 0;
    });
    setConsultants(pendencies);
    return pendencies.length;
  }

  //Filtra Contratos Desativados
  function getPendenciasContracts(rows) {
    //rows = [];
    const pendencies = rows.filter((contract) => {
      return contract.contract_activated === 0;
    });
    setContracts(contracts);
    return pendencies.length;
  }

  return (
    <Container className="container-login">
      <HeaderBackground notLogin={true} />
      <main>
        <div className="title-header">
          <h1 className="h1-profile">Dashboard</h1>
        </div>

        <div className="section-adm">
          <div className=" dashboard-adm">
            <div className="content-panel">
              <h3>Pendências</h3>
              <div className="detail-content">
                <span>{totalPendencies}</span>
                <div>
                  <Link
                    to={{
                      pathname: `/pendencies`,
                      state: { investors, consultants, contracts },
                    }}
                  >
                    <button>Visualizar</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="content-panel">
              <h3>Investidores</h3>
              <div className="detail-content">
                <span>{totInvestors}</span>
                <Link to={`/investors`}>
                  <button>Gerenciar</button>
                </Link>
              </div>
            </div>
            <div className="content-panel">
              <h3>Consultores</h3>
              <div className="detail-content">
                <span>{totConsultants}</span>
                <Link to={`/consultants`}>
                  <button>Gerenciar</button>
                </Link>
              </div>
            </div>
            <div className="content-panel">
              <h3>Contratos</h3>
              <div className="detail-content">
                <span>{totalContracts}</span>
                <Link to={`/contracts`}>
                  <button>Gerenciar</button>
                </Link>
              </div>
            </div>

            <div className="content-panel">
              <h3>Investidores Associados</h3>
              <div className="detail-content">
                <span>{totInvestorAssociated}</span>
                <div>
                  <Link to={`/associatedInvestors/${user.id}`}>
                    <button>Visualizar</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterBackground
        viewAddUser={false}
        newUser={'investor'}
        notLogin={true}
        notBack={false}
      />
    </Container>
  );
}

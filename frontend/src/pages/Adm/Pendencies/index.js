import React from 'react';

import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';
import Alert from '../../../components/Alert';

import List from '../../../components/List';

import './styles.css';
//------------------------------------------------------------

export default function ConsultantRegisters(props) {
  // console.log(props.location.state);
  const consultants = props.location.state.consultants;
  const investors = props.location.state.investors;

  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-view-list">
        <div className="title-header">
          <h1 className="h1-">Pendências de Aprovação </h1>
        </div>

        <div className="section">
          <div className="content-list" style={{ margin: '10px 0px' }}>
            <h2>Consultores</h2>
            <div className="list">
              {consultants.length !== 0 ? (
                consultants.map((consultant, key) => (
                  <List
                    key={key}
                    value_col_1={`${consultant.user.name} ${consultant.user.last_name}`}
                    url={`/detailConsultant/${consultant.user.name}`}
                    stateLink={consultant}
                    backgroundColor={
                      consultant.user.active === 0 ? true : false
                    }
                  />
                ))
              ) : (
                <Alert>Não há pendências de consultores</Alert>
              )}
            </div>
          </div>
        </div>
        <div className="section">
          <div className="content-list" style={{ marginTop: '10px 0' }}>
            <h2 style={{ marginTop: '0px' }}>Investidores </h2>
            <div className="list">
              {investors.length !== 0 ? (
                investors.map((investor, key) => (
                  <List
                    key={key}
                    value_col_1={`${investor.user.name} ${investor.user.last_name}`}
                    url={`/detailInvestor/${investor.user.name}`}
                    stateLink={investor}
                    backgroundColor={investor.user.active === 0 ? true : false}
                  />
                ))
              ) : (
                <Alert>Não há pendências de investiodres</Alert>
              )}
            </div>
          </div>
        </div>
      </main>
      <FooterBackground notLogin={true} notBack={true} />
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';

import List from '../../../components/List';
import { getYeldMonth } from '../../../controller/Consultant';
import convertCoinBr from '../../../utils/convertCoinBr';

//------------------------------------------------------------

export default function DetailIncome(props) {
  const [investorIncomeMonth, setInvestorIncomeMonth] = useState([]);
  const [totIncomeMonth, setTotIncomeMonth] = useState(0);

  useEffect(() => {
    async function yeldMonth() {
      const data = await getYeldMonth(
        props.location.state.stateLink.id_consultant, //id do consultor
        props.match.params.id, //Mes a ser filtrado
        props.location.state.stateLink.year //Ano a ser filtrado
      );
      setInvestorIncomeMonth(data.data.yield_investor);
      setTotIncomeMonth(data.data.total);
    }
    setTimeout(() => {
      yeldMonth();
    }, 500);
  }, [
    props.match.params.id,
    props.location.state.stateLink.id_consultant,
    props.location.state.stateLink.year,
  ]);

  //O css utilizado e o msm css da page dos investidores.css definido para pagina com listas
  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-view-list">
        <div className="title-header">
          <h1 className="h1-">
            Projeção de {moment(props.match.params.id, 'MM').format('MMMM')}
          </h1>
        </div>

        <div className="section">
          <div className="detail">
            <p className="weight-thin">
              &nbsp;Total Projetado:
              <b className="text-white">{convertCoinBr(totIncomeMonth)}</b>
            </p>
          </div>

          <div className="content-list">
            <h2>Rendimento ao mês</h2>

            <div className="list">
              {investorIncomeMonth.map((investor, key) => (
                <List
                  flexColumn={true}
                  key={key}
                  value_col_1={investor.name + ' ' + investor.last_name}
                  value_col_2={convertCoinBr(investor.contract_value)}
                  value_col_3={
                    investor.yields.length === 0
                      ? 'R$ 0,00'
                      : convertCoinBr(investor.yields.yield)
                  }
                  addClassCss_col_3={
                    investor.yields.length !== 0 ? 'text-green' : ''
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <FooterBackground notLogin={true} notBack={true} />
    </Container>
  );
}

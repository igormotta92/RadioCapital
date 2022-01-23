import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';

import List from '../../../components/List';
import { getYeldYear } from '../../../controller/Consultant';
import convertCoinBr from '../../../utils/convertCoinBr';

//------------------------------------------------------------

function arrayYearFilter(year, variation) {
  let years = [];
  let yearFin = year + variation;
  let yearIni = year - variation;

  while (yearIni < yearFin) {
    years.push(yearIni);
    yearIni++;
  }

  return years;
}

export default function IncomeConsultant(props) {
  const [incomeMonths, setIncomeMonths] = useState([]);
  const [totIncome, setTotIncome] = useState(0);
  const [monthCurrent, setMonthCurrent] = useState(0);
  const [monthValueCurrent, setMonthValueCurrent] = useState(0);
  const [yearCurrent, setYearCurrent] = useState(0);

  useEffect(() => {
    const dateCurrent = new Date();
    setMonthCurrent(moment(dateCurrent, 'MM').format('MMMM'));
    setYearCurrent(moment(dateCurrent).year());
  }, []);

  useEffect(() => {
    async function getIncome() {
      const data = await getYeldYear(props.match.params.id, yearCurrent);
      setIncomeMonths(data.yield_year);
      setTotIncome(data.total);
      filterValueMonth(data.yield_year, moment(yearCurrent).format('MM'));
    }

    getIncome();
  }, [yearCurrent]);

  function filterValueMonth(incomeMonths, monthCurrent) {
    let valueMonth = incomeMonths.filter((month) => {
      return month.month === monthCurrent;
    });
    setMonthValueCurrent(valueMonth[0]);
  }

  //O css utilizado e o msm css da page dos investidores.css definido para pagina com listas

  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-view-list">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          className="title-header"
        >
          <h1 className="h1-">Projeção</h1>
          <select
            onChange={(e) => setYearCurrent(e.target.value)}
            className="select-contract"
            name=""
            id=""
            value={yearCurrent}
          >
            {arrayYearFilter(2020, 5).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="section">
          <div className="detail">
            <p className="weight-thin">
              &nbsp;Total projetado:
              <b className="text-white">&nbsp;{convertCoinBr(totIncome)}</b>
            </p>
            <p className="weight-thin" style={{ marginTop: '10px' }}>
              &nbsp;Projetado {monthCurrent}:
              <b className="text-white">
                &nbsp;{convertCoinBr(monthValueCurrent.value)}
              </b>
            </p>
          </div>

          <div className="content-list">
            <h2>Projetado ao mes</h2>

            <div className="list">
              {incomeMonths.map((month, key) => (
                <List
                  key={key}
                  value_col_1={month.competence}
                  value_col_2={convertCoinBr(month.value)}
                  url={`/detailIncome/${month.month}`}
                  stateLink={{
                    year: yearCurrent,
                    id_consultant: props.match.params.id,
                  }}
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

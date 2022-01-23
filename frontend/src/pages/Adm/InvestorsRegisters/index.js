import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';
import SelectPage from '../../../components/SelectPage';

import List from '../../../components/List';
import { getAllInvestors } from '../../../controller/Adm';
import icon_new from '../../../assets/icon_new.png';

import './styles.css';
import Search from '../../../components/Search';
//------------------------------------------------------------

export default function InvestorRegisters(props) {
  const [investors, setInvestors] = useState([]);
  const [totInvestors, setTotInvestors] = useState(0);
  const [page, setPage] = useState(1);
  const [totPages, setTotPages] = useState(1);
  const [valueSearch, setValueSearch] = useState('');
  useEffect(() => {
    async function getAssoatedinvestors() {
      const data = await getAllInvestors(false, page, valueSearch);
      setInvestors(data.rows);
      setTotInvestors(data.totreg);
      setPage(data.page);
      setTotPages(data.totpages);
    }
    setTimeout(() => {
      getAssoatedinvestors();
    }, 500);
  }, [page, valueSearch]);

  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-view-list">
        <div className="title-header">
          <h1 className="h1-">Investidores</h1>
          <Link
            to={{
              pathname: '/newUser',
              state: { type: 'investor', isEdit: false },
            }}
            style={{ position: 'absolute', right: '20px', marginTop: '7px' }}
          >
            <img src={icon_new} alt="" />
          </Link>
        </div>

        <div className="section">
          <div className="detail">
            <p className="weight-thin">
              Total de Investidores:&nbsp;
              <b className="text-white">{totInvestors}</b>
            </p>
          </div>

          <div className="content-list">
            <h2>Lista de Investidores</h2>

            <div className="list">
              <Search
                valueSearch={valueSearch}
                handleSetValueSearch={setValueSearch}
              ></Search>
              {investors.map((investor, key) => (
                <List
                  key={key}
                  value_col_1={`${investor.user.name} ${investor.user.last_name}`}
                  url={`/detailInvestor/${investor.user.name}`}
                  stateLink={investor}
                  backgroundColor={investor.user.active === 0 ? true : false}
                />
              ))}
              <SelectPage
                page={page}
                handleSetPage={setPage}
                totPages={totPages}
              />
            </div>
          </div>
        </div>
      </main>
      <FooterBackground notLogin={true} notBack={true} />
    </Container>
  );
}

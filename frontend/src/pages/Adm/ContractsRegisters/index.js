import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';

import List from '../../../components/List';
import { getAllContracts } from '../../../controller/Adm';
import icon_new from '../../../assets/icon_new.png';
import SelectPage from '../../../components/SelectPage';
import Search from '../../../components/Search';
import './styles.css';
//------------------------------------------------------------

export default function ContractsRegisters(props) {
  const [contracts, setcontracts] = useState([]);
  const [totcontracts, setTotcontracts] = useState(0);
  const [page, setPage] = useState(1);
  const [totPages, setTotPages] = useState(1);
  const [valueSearch, setValueSearch] = useState('');

  useEffect(() => {
    async function getAssoatedcontracts() {
      const data = await getAllContracts(false, page, valueSearch);

      setcontracts(data.rows);
      setTotcontracts(data.totreg);
      setPage(data.page);
      setTotPages(data.totpages);
    }
    setTimeout(() => {
      getAssoatedcontracts();
    }, 500);
  }, [page, valueSearch]);

  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-view-list">
        <div className="title-header">
          <h1 className="h1-">Contratos</h1>
          <Link
            to={{
              pathname: '/newContract',
              state: { type: 'contract', isEdit: false },
            }}
            style={{ position: 'absolute', right: '20px', marginTop: '7px' }}
          >
            <img src={icon_new} alt="" />
          </Link>
        </div>

        <div className="section">
          <div className="detail">
            <p className="weight-thin">
              Total de Contratos:&nbsp;
              <b className="text-white">{totcontracts}</b>
            </p>
          </div>

          <div className="content-list">
            <h2>Lista de Contratos</h2>
            <div className="list">
              <Search
                valueSearch={valueSearch}
                handleSetValueSearch={setValueSearch}
              ></Search>
              {contracts.map((contract, key) => (
                <List
                  key={key}
                  value_col_1={`${String(contract.id).padStart('5', 0)} `}
                  url={`/detailInvestor/${contract.investor.user.name}`}
                  stateLink={contract.investor}
                  backgroundColor={
                    contract.is_vigente === false ||
                      contract.contract_activated === 0
                      ? true
                      : false
                  }
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

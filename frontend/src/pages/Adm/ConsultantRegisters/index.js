import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';

import List from '../../../components/List';
import { getAllConsultants } from '../../../controller/Adm';
import icon_new from '../../../assets/icon_new.png';
import SelectPage from '../../../components/SelectPage';
import Search from '../../../components/Search';
import './styles.css';
//------------------------------------------------------------

export default function ConsultantRegisters(props) {
  const [consultants, setconsultants] = useState([]);
  const [totconsultants, setTotconsultants] = useState(0);
  const [page, setPage] = useState(1);
  const [totPages, setTotPages] = useState(1);
  const [valueSearch, setValueSearch] = useState('');

  useEffect(() => {
    async function getAssoatedconsultants() {
      const data = await getAllConsultants(false, page, valueSearch);
      setconsultants(data.rows);
      setTotconsultants(data.totreg);
      setPage(data.page);
      setTotPages(data.totpages);
    }
    setTimeout(() => {
      getAssoatedconsultants();
    }, 500);
  }, [page, valueSearch]);

  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-view-list">
        <div className="title-header">
          <h1 className="h1-">Consultores</h1>
          <Link
            to={{
              pathname: '/newUser',
              state: { type: 'consultant', isEdit: false },
            }}
            style={{ position: 'absolute', right: '20px', marginTop: '7px' }}
          >
            <img src={icon_new} alt="" />
          </Link>
        </div>

        <div className="section">
          <div className="detail">
            <p className="weight-thin">
              Total de Consultores:&nbsp;
              <b className="text-white">{totconsultants}</b>
            </p>
          </div>

          <div className="content-list">
            <h2>Lista de Consultores</h2>
            <div className="list">
              <Search
                valueSearch={valueSearch}
                handleSetValueSearch={setValueSearch}
              ></Search>
              {consultants.map((consultant, key) => (
                <List
                  key={key}
                  value_col_1={`${consultant.user.name} ${consultant.user.last_name}`}
                  url={`/detailConsultant/${consultant.user.name}`}
                  stateLink={consultant}
                  backgroundColor={consultant.user.active === 0 ? true : false}
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

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';
import LineChart from '../../../components/Graphics/line';

import { AllAssoatedinvestors } from '../../../controller/Consultant';
import { getYeldYear } from '../../../controller/Consultant';

import './styles.css';

//------------------------------------------------------------
import { useAuthContext } from '../../../Context/AuthContext';

export default function Profile() {
  const { user } = useAuthContext();
  const [dataProjection, setDataProjection] = useState({
    values: [],
    months: [],
  });
  const [totInvestors, setTotInvestors] = useState(0);

  useEffect(() => {
    // Create an scoped async function in the hook
    async function getInvestor() {
      const data = await AllAssoatedinvestors(user.id);
      setTotInvestors(data.totreg);
    }
    getInvestor();
    //Execute the created function directly
  }, [user.id]);

  useEffect(() => {
    async function handleYealdYear() {
      const dateCurrent = new Date();
      const data = await getYeldYear(user.id, moment(dateCurrent).year());

      setDataProjection(handleProjection(data.yield_year));
    }
    handleYealdYear();
  }, [user.id]);

  function handleProjection(data) {
    let values = data.map((month, count) => {
      return month.value;
    });
    let months = data.map((month) => {
      return moment(month.month).format('MMM').capitalize();
    });
    return { values, months };
  }

  // console.log(dataProjection);
  return (
    <Container className="container-login">
      <HeaderBackground notLogin={true} />
      <main>
        <div className="title-header">
          <h1 className="h1-profile">Dashboard</h1>
        </div>
        <div className="dashboard">
          <div className="content-projection">
            <p>Projeção Anual</p>
            <div className="graph pie">
              <LineChart data={dataProjection}></LineChart>
            </div>
            <Link to={`/incomeConsultant/${user.id}`}>
              <button>Ver detalhes</button>
            </Link>
          </div>
          <div className="content-investor">
            <h3>Investidores Associados</h3>
            <div className="detail-associated">
              <span>{totInvestors}</span>
              <Link to={`/associatedInvestors/${user.id}`}>
                <button>Ver detalhes</button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <FooterBackground
        viewAddUser={true}
        newUser={{ type: 'investor', isEdit: false }}
        notLogin={true}
        notBack={false}
      />
    </Container>
  );
}

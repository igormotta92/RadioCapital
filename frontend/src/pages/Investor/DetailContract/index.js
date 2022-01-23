import React, { useState, useEffect } from 'react';
import moment from 'moment';

//Components
import Container from '../../../components/Container';
import HeaderBackground from '../../../components/HeaderBackground';
import FooterBackground from '../../../components/FooterBackground';
import Loading from '../../../components/Loading';

//services
import findContract from '../../../controller/Investor/findContract';

//Functions aux
import convertCoinBr from '../../../utils/convertCoinBr';

import './styles.css';

//------------------------------------------------------------

export default function DetailInvestment(props) {
  const [contract, setContract] = useState({});

  useEffect(() => {
    async function getContract() {
      const data = await findContract(props.match.params.id);
      setContract(data);
    }

    setTimeout(() => {
      getContract();
    }, 500);
  }, [props.match.params.id]);

  if (Object.entries(contract).length === 0) return <Loading />;

  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-detail-contract">
        <div className="title-header">
          <h1 className="h1-">Investimento</h1>
          <p>contrato: {contract.id.toString().padStart('5', '0')}</p>
        </div>

        <div className="content-contract">
          <p className="text-beige">
            Data de Inicio:{' '}
            <b className="text-white">{moment(contract.begin).format('L')}</b>
          </p>
          <p className="text-beige">
            Data de Termino:{' '}
            <b className="text-white">{moment(contract.final).format('L')}</b>
          </p>
          <p className="text-beige">
            Prazo: <b className="text-white">{contract.time} Meses</b>
          </p>
          <p className="text-beige">
            Valor Investido:{' '}
            <b className="text-white">{convertCoinBr(contract.value)}</b>
          </p>
          <p className="text-beige">
            Dia do pagamento:{' '}
            <b className="text-white">
              {contract.day.toString().padStart(2, 0)}
            </b>
          </p>
          <p className="text-beige">
            Consultor:{' '}
            <b className="text-white">
              {contract.investor.consultant.user.fullname}
            </b>
          </p>
        </div>
      </main>
      <FooterBackground notBack={true} notLogin={true} />
    </Container>
  );
}

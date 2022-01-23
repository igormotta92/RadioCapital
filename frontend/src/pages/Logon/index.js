import React, { useState } from 'react';

/* Componentes propios*/
import Container from '../../components/Container';
import HeaderBackground from '../../components/HeaderBackground';
import FooterBackground from '../../components/FooterBackground';

import logo from '../../assets/logo_radio.png';
import './styles.css';
//------------------------------------------------------------

import { useAuthContext } from '../../Context/AuthContext';

export default function Logon() {
  const [email, setEmail] = useState('consultant_32070@gmail.com');
  const [password, setpassword] = useState('32070');

  const { handleLogon } = useAuthContext();

  return (
    <Container>
      <HeaderBackground notLogin={false} />

      <div className="content">
        <div className="main-login">
          <img src={logo} alt="logo" />

          <form onSubmit={(e) => handleLogon(e, email, password)}>
            <div className="form-inputs">
              <input
                type="text"
                value={email}
                placeholder="E-mail"
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <input
                type="password"
                value={password}
                placeholder="Senha"
                onChange={(e) => setpassword(e.target.value)}
              ></input>
            </div>
            <button>ACESSAR</button>
          </form>
        </div>
      </div>
      <FooterBackground notLogin={false} />
    </Container>
  );
}

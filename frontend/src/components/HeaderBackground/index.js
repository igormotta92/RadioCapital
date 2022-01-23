import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

import logo_nav from '../../assets/logo_radio.svg';
import icon_messages from '../../assets/icon_messages.png';
import icon_profile from '../../assets/icon_profile.png';
import icon_exit from '../../assets/icon_exit.png';
import { useAuthContext } from '../../Context/AuthContext';

//------------------------------------------------------------
function ContentHeader() {
  const { handleLogout, user } = useAuthContext();

  return (
    <nav>
      <Link to="/">
        <img className="logo-nav" src={logo_nav} alt="" />
      </Link>

      <div className="icons-button">
        {user.is_admin !== 1 && (
          <Link to="/messages">
            {' '}
            <img src={icon_messages} alt="" />
          </Link>
        )}

        <Link to="/view-profile">
          {' '}
          <img src={icon_profile} alt="" />
        </Link>
        <img src={icon_exit} onClick={(e) => handleLogout(e)} alt="" />
      </div>
    </nav>
  );
}

export default function HeaderBackground(props) {
  return <header>{props.notLogin === true ? <ContentHeader /> : ''}</header>;
}

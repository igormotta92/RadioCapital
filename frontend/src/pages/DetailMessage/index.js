import React from 'react';

import icon_profile_m from '../../assets/icon_profile_m.png';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './styles.css';

//------------------------------------------------------------

export default function detailMessage(props) {
  return (
    <div className="content-detail-message">
      <div className="nav">
        <ArrowBackIcon
          className="back-messages"
          style={{ color: 'white' }}
          onClick={() => props.viewDetail(false)}
        >
          back
        </ArrowBackIcon>
        <div>
          <img src={icon_profile_m} alt="" />
        </div>
        <h3 className="name-auth-message">{props.user_send.name}</h3>
      </div>

      <div className="content-message">
        <div className="box-message">
          <p className="description-message">{props.messagem}</p>
        </div>
      </div>
    </div>
  );
}

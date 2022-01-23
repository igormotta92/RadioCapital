import React, { useState, useEffect } from 'react';

import icon_profile_m from '../../assets/icon_profile_m.png';
import DetailMessage from '../../pages/DetailMessage';

export default function Message(props) {
  let viewStyle = '';
  let viewIcon = '';
  const [viewDetail, setViewDetail] = useState(false);

  function onChildChanged(bool) {
    setViewDetail(bool);
  }

  function handleViwed(bool) {
    try {
      //const data = api.post()
    } catch (error) {}
    setViewDetail(bool);
  }

  useEffect(() => console.log(1), [viewDetail]);

  if (props.viewed !== 0) {
    viewStyle = 'bg-message-deals';
    viewIcon = 'hide-icon-alert';
  }

  return (
    <div>
      <div className={`message ${viewStyle}`} onClick={() => handleViwed(true)}>
        <div>
          <img src={icon_profile_m} alt="" />
        </div>
        <div className="text">
          <h3>{props.user_send.name}</h3>
          <p>{props.messagem}</p>
        </div>
        <div className="status">
          <span className={`notification-read ${viewIcon}`}></span>
        </div>
      </div>

      {viewDetail && (
        <DetailMessage
          messagem={props.messagem}
          user_send={props.user_send}
          viewDetail={(bool) => onChildChanged(bool)}
        />
      )}
    </div>
  );
}

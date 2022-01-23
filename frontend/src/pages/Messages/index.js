import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../Context/AuthContext';

import api from '../../services/api';

import Container from '../../components/Container';
import HeaderBackground from '../../components/HeaderBackground';
import FooterBackground from '../../components/FooterBackground';
import Message from '../../components/Message';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import './styles.css';
//------------------------------------------------------------

export default function Messages() {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getMessages() {
      try {
        const { data } = await api.get(`/users/${user.id_user}/messages`);

        setMessages(data.data);
      } catch (error) {
        alert(error.response);
      }
    }
    getMessages();
  }, [user.id_user]);
  //console.log(messages);
  return (
    <Container>
      <HeaderBackground notLogin={true} />
      <main className="main-msg">
        <div className="title-header">
          <h1>Suas Mensagens</h1>
        </div>

        <div className="content-message">
          {messages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h3 className="text-white">Você não possui menssagens</h3>
              <span style={{ margin: '20px auto' }}>
                <SentimentVeryDissatisfiedIcon
                  style={{ color: 'var(--text-color-beige)', fontSize: '2em' }}
                />
              </span>
            </div>
          ) : (
            ''
          )}
          {messages.map((message, key) => {
            //  console.log(message.users[0].MessageUserView.viewed);
            if (message.users[0].MessageUserView.viewed === 0) {
              return (
                <Message
                  messagem={
                    message.messagem.substring(0, 30) +
                    (message.messagem.length > 31 ? '...' : '')
                  }
                  user_send={message.user_send}
                  key={key}
                  viewed={message.users[0].MessageUserView.viewed}
                />
              );
            }
            return (
              <Message
                key={key}
                messagem={
                  message.messagem.substring(0, 30) +
                  (message.messagem.length > 31 ? '...' : '')
                }
                user_send={message.user_send}
                viewed={message.users[0].MessageUserView.viewed}
              />
            );
          })}
        </div>
      </main>
      <FooterBackground notBack={true} notLogin={true} />
    </Container>
  );
}

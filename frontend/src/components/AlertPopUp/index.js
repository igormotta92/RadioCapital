import React from 'react';
import styled from 'styled-components';
import WarningIcon from '@material-ui/icons/Warning';
import FadeIn from '../FadeIn';

const Warning = styled.div`
  top: 0;
  background-color: var(--bg-color);
  box-shadow: var(--shadow-bottom);
  width: 100%;
  height: 100vh;
  max-width: 600px;
  color: black;
  font-size: 1em;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  filter: opacity(96%);
  @key;
`;

const ButtonAlert = styled.button`
  background-color: white;
  color: black;
  font-size: 1em;
  border-radius: 10px;
  padding: 10px 70px;
  margin: 10px;
  border: 0px;
`;
const Text = styled.p`
  font-size: 20px;
  color: white;
  margin: 15px;
  text-align: center;
  font-weight: 200;
`;

export default function AlertPopUp(props) {
  window.scrollTo(0, document.querySelector('body'));
  return (
    <FadeIn duration="0.8s" delay="0.2s">
      <Warning>
        <WarningIcon
          style={{
            top: '7px',
            fontSize: '80px',
            color: 'var(--text-color-beige)',
          }}
        />
        <Text>{props.children}</Text>
        <div className="button-alert">
          <ButtonAlert
            onClick={(e) => {
              props.handleSetAlertMessage(false);
            }}
          >
            OK
          </ButtonAlert>
        </div>
      </Warning>
    </FadeIn>
  );
}

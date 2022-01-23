import React from 'react';
import styled from 'styled-components';
import WarningIcon from '@material-ui/icons/Warning';

const Warning = styled.div`
  background: yellow;
  color: black;
  padding: 10px;
  font-size: 1em;
  border-radius: 10px;
  position: relative;
  display: flex;
`;

export default function Alert(props) {
  return (
    <Warning>
      <WarningIcon styled={{ position: 'absolute', top: '7px' }} />
      <p style={{ paddingLeft: '5px' }}>{props.children}</p>
    </Warning>
  );
}

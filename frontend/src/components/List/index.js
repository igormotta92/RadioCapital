import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-items: center;
  padding: 10px 15px;
  margin: 2px 0px;
  background-color: var(--bg-color-variant);
  border-radius: 10px;
`;

export default function ListContracts(props) {
  const stateLink = props.stateLink;

  let styleColumn = {};

  let deactivate = {};
  if (props.flexColumn === true) {
    styleColumn = { padding: '10px 0px ' };
  }
  if (props.backgroundColor) {
    deactivate = { backgroundColor: '#1d1d1d' };
  }

  return props.flexColumn === true ? (
    <Ul style={{ flexDirection: 'column' }}>
      <li className="text-white">{props.value_col_1}</li>
      <li style={styleColumn} className="text-beige">
        {props.value_col_2}
      </li>
      {props.url && (
        <li>
          <Link
            id="link"
            to={{
              pathname: props.url,
              state: { stateLink },
            }}
          >
            <NavigateNextIcon
              style={{
                color: 'green',
                backgroundColor: 'var(--bg-color-05)',
                borderRadius: '100%',
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 1)',
              }}
            />
          </Link>
        </li>
      )}
      {props.value_col_3 && (
        <li className={`text-beige ${props.addClassCss_col_3}`}>
          {props.value_col_3}
        </li>
      )}
    </Ul>
  ) : (
    <Ul style={deactivate}>
      <li className="text-white">{props.value_col_1}</li>
      <li style={styleColumn} className="text-beige">
        {props.value_col_2}
      </li>

      {props.url && (
        <li>
          <Link
            id="link"
            to={{
              pathname: props.url,
              state: { stateLink },
            }}
          >
            <NavigateNextIcon
              style={{
                color: 'green',
                backgroundColor: 'var(--bg-color-05)',
                borderRadius: '100%',
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 1)',
              }}
            />
          </Link>
        </li>
      )}
      {props.value_col_3 && (
        <li className={`text-beige ${props.addClassCss_col_3}`}>
          {props.value_col_3}
        </li>
      )}
    </Ul>
  );
}

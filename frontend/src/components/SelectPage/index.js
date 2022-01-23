import React from 'react';
import styled from 'styled-components';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const Pages = styled.div`
  width: 60px;
  color: black;
  padding: 10px;
  font-size: 1em;
  position: relative;
  display: flex;
  float: right;
`;

export default function SelectPage(props) {
  let next = '';
  let back = '';
  if (props.totPages !== props.page) {
    next = '#a0770a';
    back = '';
  } else {
    next = '';
    back = '#a0770a';
  }
  //console.log(props.page);
  return (
    <Pages>
      {props.totPages !== 1 && props.totPages !== 0 && (
        <>
          {' '}
          <NavigateBeforeIcon
            style={{ color: back, cursor: 'pointer' }}
            onClick={(e) =>
              1 !== props.page && props.handleSetPage(props.page - 1)
            }
          />
          <p style={{ color: 'white' }}>{props.page}</p>
          <NavigateNextIcon
            style={{ color: next, cursor: 'pointer' }}
            onClick={(e) =>
              props.totPages !== props.page &&
              props.handleSetPage(props.page + 1)
            }
          />
        </>
      )}
    </Pages>
  );
}

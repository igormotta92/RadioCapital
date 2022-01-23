import React from 'react';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
const Select = styled.div`
  background-color: black;
  width: 100%;
  padding: 10px 20px;
  border: 0px;
  border-radius: 20px;
  color: white;
  box-shadow: var(--shadow-bottom);
  transition: all 0.5s ease-out;
  &:hover {
    background-color: var(--bg-color-05);
    color: white;
    border: 0px;
    box-shadow: var(--shadow-bottom);
  }
`;
const ContainerList = styled.div`
  width: 100%;
  max-width: 350px;
  color: red;
  top: 0;
  font-size: 1em;
  position: absolute;
  display: flex;
  background-color: red;
`;
export default function SelectListPopUp(props) {
  return <ContainerList>a</ContainerList>;
}

import React from 'react';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
const InputSearch = styled.input`
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
const ContainerSearch = styled.div`
  width: 100%;
  color: white;
  padding: 5px 0px;
  font-size: 1em;
  position: relative;
  display: flex;
  backgrond-color: #cecece;
`;
export default function Search(props) {
  return (
    <ContainerSearch>
      <InputSearch
        type="text"
        name="search"
        id="search"
        placeholder="Pesquisar"
        value={props.valueSearch}
        onChange={(e) => props.handleSetValueSearch(e.target.value)}
      />
      <SearchIcon
        style={{ position: 'absolute', right: '20px', marginTop: '5px' }}
      />
    </ContainerSearch>
  );
}

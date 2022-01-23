import api from '../../services/api';

async function AllAssoatedinvestors(id_consultant, page) {
  try {
    const { data } = await api.get(
      `/consultants/${id_consultant}/investors?page=${page}`
    );
    //console.log(data.data);
    return data.data;
  } catch (error) {
    // console.log(error.response);
    return error;
  }
}

async function getInvestorAssociated(id_investor) {
  try {
    const { data } = await api.get(`/consultants/${id_investor}/investors/`);
    // console.log(data);
    return data.rows[0];
  } catch (error) {
    // console.log(error.response);
    return error;
  }
}

async function getYeldYear(id_consultant, year) {
  try {
    const { data } = await api.get(
      `/consultants/${id_consultant}/yield/${year}`
    );
    // console.log(data);
    return data.data;
  } catch (error) {
    // console.log(error.response);
    return error;
  }
}

async function getYeldMonth(id_consultant, month, year) {
  try {
    const { data } = await api.get(
      `/consultants/${id_consultant}/yield/${year}/month-detail/${month}`
    );
    // console.log(data);
    return data;
  } catch (error) {
    // console.log(error.response);
    return error;
  }
}

export {
  AllAssoatedinvestors,
  getInvestorAssociated,
  getYeldYear,
  getYeldMonth,
};

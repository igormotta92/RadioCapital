import api from '../../services/api';

export default async function allContracts(id) {
  try {
    // const { data } = await api.get(`/investors/${id}/contracts`,{
    //     headers:{Authorization:api.defaults.headers.Authorization}
    // });

    const { data } = await api.get(`/investors/${id}/contracts`);

    return data.data.rows;
  } catch (error) {
    // console.log(error);
    return error;
  }
}

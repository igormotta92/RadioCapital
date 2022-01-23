import api from '../../services/api';

export default async function findContract(id) {
  try {
    const { data } = await api.get(`/consultants/${id}`);
    return data.user;
  } catch (error) {
    //console.log(error);
    return error;
  }
}

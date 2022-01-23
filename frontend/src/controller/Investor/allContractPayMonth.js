import api from '../../services/api';

export default async function allContracts(id_contract) {
  try {
    const { data } = await api.get(
      `/contracts/${id_contract}/contractspaymonth`
    );
    // console.log(data);
    return data.data;
  } catch (error) {
    //   console.log(error);
    //  console.log(error.response);
    return error;
  }
}

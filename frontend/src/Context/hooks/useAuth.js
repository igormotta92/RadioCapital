import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

import erros from '../../utils/erros';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

export default function useAuth() {
  const history = useHistory();

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  //https://blog.rocketseat.com.br/reactjs-autenticacao/

  useEffect(() => {
    function loadStorageData() {
      try {
        //const storageToken = localStorage.getItem('token_radio_Capital');
        const storageToken = getCookie('token_radio_Capital');

        if (storageToken) {
          api.defaults.headers.Authorization = `Bearer ${storageToken}`;
          const { payload } = jwtDecode(storageToken);
          setUser(payload.user);
          setAuthenticated(true);
        }
      } catch {
        alert('Token inválido');
        _logout();
      }

      setLoading(false);
    }
    loadStorageData();
  }, []);

  function jwtDecode(t) {
    const [header, payload] = t.split('.');
    return {
      raw: t,
      header: window.atob(header),
      payload: JSON.parse(window.atob(payload)),
    };
  }

  async function handleLogon(e, email, password) {
    e.preventDefault();
    try {
      const { data } = await api.post('/login', { email, password });
      const { token } = data.data;
      const { payload } = jwtDecode(token);

      //localStorage.setItem('token_radio_Capital', token);
      //document.cookie = `token_radio_Capital=${token};max-age=${60 * 60 * 1};`
      setCookie('token_radio_Capital', token, 1);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(payload.user);
      setAuthenticated(true);

      Swal.fire({
        title: 'Sucesso',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#121212',
        confirmButtonColor: '#a0770a',
      });

      // history.push('/profile');
    } catch (error) {

      setAuthenticated(false);
      //const msg = (error.response) ? error.response.data.message : error.message;

      Swal.fire({
        title: 'Erro!',
        text: erros.getMessage(error),
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#121212',
        confirmButtonColor: '#a0770a',
      });
    }
  }

  async function handleLogout(e) {
    e.preventDefault();
    _logout();
  }

  function _logout() {
    //localStorage.removeItem('token_radio_Capital');
    deleteCookie("token_radio_Capital");
    //localStorage.removeItem('user');
    api.defaults.headers.Authorization = undefined;
    setUser({});
    setAuthenticated(false);
  }

  return {
    authenticated,
    handleLogon,
    handleLogout,
    loading,
    user,
    setUser,
  };
}

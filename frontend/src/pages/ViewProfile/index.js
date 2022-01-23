import React, { useState, useEffect } from 'react';

import Container from '../../components/Container';
import HeaderBackground from '../../components/HeaderBackground';
import FooterBackground from '../../components/FooterBackground';

import icon_profile_my from '../../assets/icon-profile-my.png';
import EditIcon from '@material-ui/icons/Edit';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
//masks
import { maskTel, cpfMask } from '../../utils/maskInputs';
//------------------------------------------------------------
import { useAuthContext } from '../../Context/AuthContext';
import { editUser, detailUser } from '../../controller/user';

import './styles.css';
import { Link } from 'react-router-dom';

export default function ViewProfile() {
  const { user } = useAuthContext();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cpf, setCpf] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [imgProfile, setImgProfile] = useState('');

  useEffect(() => {
    async function getDetailProfile() {
      const data = await detailUser(user.id, user.type);

      setName(data.name);
      setLastName(data.last_name);
      setCpf(cpfMask(data.identif));
      setTel(maskTel(data.tel));
      setEmail(data.email);
      setImgProfile(data.profile);
    }

    getDetailProfile();
  }, [user.id, user.type]);

  //Funçao trata os dados passados no formulario , e chamara funçao que fara a requisiçao de update.
  async function handdleSubmit(e) {
    e.preventDefault();

    let formData = new FormData();

    formData.append('profile', e.target[0].files[0]);
    formData.append('tel', tel.replace(/[()-]/g, ''));
    formData.append('email', email);

    const response = await editUser(formData, user.id, user.type);
    alert(response);
  }

  function handdleInputImage(image) {
    const reader = new FileReader();

    if (image.type.search(/[Ii]+[Mm]+[Aa]+[Gg]+[Ee]/) === -1) {
      alert('Por favor insira uma imagem');
      return;
    }

    reader.onload = () => setImgProfile({ url: reader.result });
    reader.readAsDataURL(image);
  }

  return (
    <Container className="container-login">
      <HeaderBackground notLogin={true} />
      <main className="main-myprofile">
        <div className="title-header">
          <h1>Perfil</h1>
          <Link to="/">
            <VpnKeyIcon style={{ color: 'yellow', marginTop: '20px' }} />
          </Link>
        </div>

        <div className="content-form">
          <form
            encType="multipart/form-data"
            onSubmit={(e) => handdleSubmit(e)}
          >
            <div className="upload-photo">
              <label htmlFor="photo" style={{ cursor: 'pointer' }}>
                <div className="photo-ptofile">
                  <img
                    src={imgProfile !== null ? imgProfile.url : icon_profile_my}
                  />
                </div>
                <span>ALTERAR FOTO</span>
              </label>
              <input
                id="photo"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handdleInputImage(e.target.files[0])}
              />
            </div>

            <div className="no-edit-form">
              <label htmlFor="nome" className="label">
                Nome
              </label>
              <input
                type="text"
                readOnly={true}
                value={name}
                style={{ cursor: ' context-menu' }}
              />
            </div>
            <div className="no-edit-form">
              <label htmlFor="sobreNome" className="label">
                Sobre nome
              </label>
              <input
                type="text"
                readOnly={true}
                value={lastName}
                style={{ cursor: ' context-menu' }}
              />
            </div>
            <div className="no-edit-form">
              <label htmlFor="cpf" className="label">
                CPF
              </label>
              <input
                type="text"
                readOnly={true}
                value={cpf}
                style={{ cursor: ' context-menu' }}
              />
            </div>
            <div className="edit-form">
              <label htmlFor="tel" className="label">
                Telefone
              </label>
              <input
                id="tel"
                type="text"
                onChange={(e) => setTel(maskTel(e.target.value))}
                value={tel}
              />
              <EditIcon className="icon-edit" />
            </div>

            <div className="edit-form">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <EditIcon className="icon-edit" />
            </div>

            <button style={{ padding: '10px 90px', marginTop: '30px' }}>
              SALVAR
            </button>
          </form>
        </div>
      </main>
      <FooterBackground notBack={true} notLogin={true} />
    </Container>
  );
}

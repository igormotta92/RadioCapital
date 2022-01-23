import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import icon_new from '../../assets/icon_new.png';
import { useAuthContext } from '../../Context/AuthContext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

//------------------------------------------------------------
function ContentFooter(props) {
  return (
    <p className="text-white">
      {props.textview1}, <b className="text-beige">{props.textview2}</b>
    </p>
  );
}

export default function FooterBackground(props) {
  const { user } = useAuthContext();
  // ('Footer 1');
  const history = useHistory();
  return (
    <footer>
      {props.notBack && (
        <Link className="back-link" to={''}>
          <ArrowBackIcon
            style={{ color: 'white' }}
            onClick={(e) => history.goBack()}
          />
        </Link>
      )}

      {/* {props.notLogin === true ? <ContentFooter textview1="Bem Vindo" textview2="Lucas Soares"/>:''} */}
      {props.notLogin === true ? (
        <ContentFooter textview1="Bem Vindo" textview2={user.name} />
      ) : (
        ''
      )}
      {props.viewAddUser && (
        <Link
          to={{
            pathname: '/newUser',
            state: props.newUser,
          }}
          style={{ position: 'absolute', right: '20px', marginTop: '7px' }}
        >
          <img src={icon_new} alt="" />
        </Link>
      )}
    </footer>
  );
}

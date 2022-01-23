//import React, { useContext } from 'react';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import AuthProvider, { useAuthContext } from '../Context/AuthContext';

import Logon from '../pages/Logon';
import InvestorProfile from '../pages/Investor/Profile';

import ViewProfile from '../pages/ViewProfile';
import Messages from '../pages/Messages';

import DetailInvestment from '../pages/Investor/DetailInvestment';
import DetailContract from '../pages/Investor/DetailContract';
import NewUser from '../pages/NewUser';
import Page404 from '../pages/Page404';

import ConsultantProfile from '../pages/Consultant/Profile';
import AssociatedInvestors from '../pages/Consultant/AssociatedInvestors';
import DetailInvestor from '../pages/Consultant/DetailInvestor';
import IncomeConsultant from '../pages/Consultant/IncomeConsultant';
import DetailIncome from '../pages/Consultant/DetailIncome';

import AdmProfile from '../pages/Adm/Profile';
import InvestorRegisters from '../pages/Adm/InvestorsRegisters';
import EditContract from '../pages/Adm/EditContract';
import ConsultantRegisters from '../pages/Adm/ConsultantRegisters';
import DetailConsultant from '../pages/Adm/DetailConsultant';
import Pendencies from '../pages/Adm/Pendencies';
import ContractsRegisters from '../pages/Adm/ContractsRegisters';
import NewContract from '../pages/Adm/NewContract';

import Loading from '../components/Loading';

const PrivateRoute = ({ component: Component, is_profile, nivel, ...rest }) => {
  //const { loading, authenticated } = useContext(AuthContext);
  const { loading, authenticated, user } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  const user_profile = {
    investor: '/InvestorProfile',
    consultant: user.is_admin ? '/admProfile' : '/ConsultantProfile',
  };

  nivel = !nivel ? 0 : nivel;
  const user_nivel = user.is_admin ? 2 : user.type == 'consultant' ? 1 : 0;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (props.match.path !== '/login' && !authenticated) {
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          );
        } else if (props.match.path === '/login' && authenticated) {
          return (
            <Redirect
              to={{
                pathname: user_profile[user.type],
                state: { from: props.location },
              }}
            />
          );
        } else {
          let hasRight = true;
          if (is_profile && props.match.path != user_profile[user.type]) {
            hasRight = false;
          } else if (user_nivel < nivel) {
            hasRight = false;
          }

          if (!hasRight) {
            return (
              <Redirect
                to={{ pathname: '/login', state: { from: props.location } }}
              />
            );
          }

          return <Component {...props} />;
        }
      }}
    />
  );
};

//<Route path="/*"  component = {Page404} />

export default function Routes() {
  //const [userr,setUserr] = useState({"type":''})

  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>
          {/* Outros  */}
          <Route path="/Loading" component={Loading} />
          {/*É private apenas para ter o teste e já saber se já está logado ou
            não no sistema
            */}
          <PrivateRoute path="/login" component={Logon} />
          {/* ----------------- Investidor */}
          <PrivateRoute path="/view-profile" component={ViewProfile} />
          <PrivateRoute
            path="/InvestorProfile"
            is_profile
            component={InvestorProfile}
          />
          <PrivateRoute
            path="/detail-investment/:id"
            component={DetailInvestment}
          />
          <PrivateRoute
            path="/detail-contract/:id"
            component={DetailContract}
          />
          {/* <PrivateRoute path="/listUsers"  component={ListUsers} /> */}
          <PrivateRoute path="/messages" component={Messages} />
          {/* <PrivateRoute path="/RegisterContract"  component={RegisterContract} /> */}
          {/* <PrivateRoute path="/RegisterUsers"  component={RegisterUsers} /> */}
          {/* ----------------- Consultor */}
          <PrivateRoute
            path="/ConsultantProfile"
            is_profile
            component={ConsultantProfile}
          />
          <PrivateRoute
            path="/associatedInvestors/:id"
            nivel="1"
            component={AssociatedInvestors}
          />
          <PrivateRoute
            path="/detailInvestor/:name"
            nivel="1"
            component={DetailInvestor}
          />
          <PrivateRoute
            path="/incomeConsultant/:id"
            nivel="1"
            component={IncomeConsultant}
          />
          <PrivateRoute
            path="/detailIncome/:id"
            nivel="1"
            component={DetailIncome}
          />
          <PrivateRoute path="/newuser" nivel="1" component={NewUser} />
          {/* ----------------- Adm  */}
          <PrivateRoute
            path="/admProfile"
            is_profile
            nivel="2"
            component={AdmProfile}
          ></PrivateRoute>
          <PrivateRoute
            path="/investors"
            nivel="2"
            component={InvestorRegisters}
          ></PrivateRoute>
          <PrivateRoute
            path="/editContract"
            nivel="2"
            component={EditContract}
          ></PrivateRoute>{' '}
          <PrivateRoute
            path="/consultants"
            nivel="2"
            component={ConsultantRegisters}
          ></PrivateRoute>{' '}
          <PrivateRoute
            path="/detailConsultant"
            nivel="2"
            component={DetailConsultant}
          ></PrivateRoute>
          <PrivateRoute
            path="/pendencies"
            nivel="2"
            component={Pendencies}
          ></PrivateRoute>
          <PrivateRoute
            path="/contracts"
            nivel="2"
            component={ContractsRegisters}
          ></PrivateRoute>
          <PrivateRoute
            path="/newContract"
            nivel="2"
            component={NewContract}
          ></PrivateRoute>
          <PrivateRoute path="/*" component={Page404} />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

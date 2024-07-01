import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './dx-styles.scss';
import { NavigationProvider } from './contexts/navigation';
import { useScreenSizeClass } from './utils/media-query';
import Content from './Content';
import UnauthenticatedContent from './UnauthenticatedContent';
import {AuthContextProvider} from "./components/auth-store/auth-context";
import { useContext, useEffect, useState } from 'react';
import AuthContext from './components/auth-store/auth-context';
// import 'bootstrap/dist/css/bootstrap.css';


// import LoadPanel from 'devextreme-react/load-panel';
// import { AuthProvider, useAuth } from './contexts/auth';

function App() {
  const authCtx = useContext(AuthContext);
  const isLogin = authCtx.isLoggedIn;


  if (isLogin) {
    return <Content />;
  }else{
    return <UnauthenticatedContent />;
  }

}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <AuthContextProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <App />
          </div>
        </NavigationProvider>
      </AuthContextProvider>
    </Router>
  );
}

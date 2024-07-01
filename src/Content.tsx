import { Routes, Route, Navigate } from 'react-router-dom';
import appInfo from './app-info';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import React, {useContext, useEffect} from "react";
import AuthContext from "./components/auth-store/auth-context";
import Search from "./pages/search/search/search";

const Content=()=>{
    const authCtx = useContext(AuthContext);
    const isLogin = authCtx.isLoggedIn;

   useEffect(() => {
     if (isLogin) {
       authCtx.getUser();
     }
   }, [isLogin]);

     return (
       <SideNavBarLayout title={appInfo.title}>
         <Routes>
           {routes.map(({ path, element }) => (
             <Route
               key={path}
               path={path}
               element={element}
             />
           ))}
           <Route
             path='*'
             element={<Navigate to='/home' />}
           />

         </Routes>
         <Footer>
           Copyright © 2024-{new Date().getFullYear()}  &nbsp; VTW Inc.
             &nbsp;&nbsp;
             <a href="http://13.125.16.155/notice/main" >VTW TRS</a>
           <br />
           All trademarks or registered trademarks are property of their
           respective owners.
             <br />
         </Footer>
       </SideNavBarLayout>
     );
}

export default Content;


import React, { useState, useEffect, useCallback } from "react";
import * as authAction from './auth-action';

let logoutTimer: NodeJS.Timeout;

type Props = { children?: React.ReactNode }

type UserInfo = { userId: string, userSeq:number, userName:string};


// 0. login token
type LoginToken = {
  grantType: string,
  accessToken: string,
  tokenExpiresIn: number
}

// 1. 컨택스트 생성
const AuthContext = React.createContext({
  token: '',
  userObj: { userId: '',userSeq: 0 ,userName: ''},
  isLoggedIn: false,
  isSuccess: false,
  isGetSuccess: false,
  getUser: () => {},
  login: (userId:string, userPw: string) => {},
  logout: () => {}
});


// 2. 권한 컨택스트 제공
export const AuthContextProvider: React.FC<Props> = (props) => {
    
    // 토큰 데이터 조회
    const tokenData = authAction.retrieveStoredToken();

    let initialToken: any;
    if (tokenData) {
        initialToken = tokenData.token!;
    }

    const [token, setToken] = useState(initialToken);
    const [userObj, setUserObj] = useState({
        userId: '',userSeq:0,userName:''
    });

    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isGetSuccess, setIsGetSuccess] = useState<boolean>(false);

    const userIsLoggedIn = !!token;


    // 로그인 핸들러
    const loginHandler = (userId:string, userPw: string) => {

       //로그인 액션
       const data = authAction.loginActionHandler(userId, userPw);

       data.then((result) => {
         if (result !== null) {
           const loginData:LoginToken = result.data;
           setToken(loginData.accessToken);
           setIsSuccess(true);

           logoutTimer = setTimeout(
             logoutHandler,
             authAction.loginTokenHandler(loginData.accessToken, loginData.tokenExpiresIn)
           );

         }
       })
     };

    
    //로그아웃 핸들러
    const logoutHandler = useCallback(() => {
      setToken('');
      authAction.logoutActionHandler();
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    }, []);

    
    //유저정보 가져오는 핸들러
    const getUserHandler = () => {

      setIsGetSuccess(false);
      const data = authAction.getUserActionHandler(token);
      data.then((result) => {
        if (result !== null) {

          const userData:UserInfo = result.data;
          setUserObj(userData);
          setIsGetSuccess(true);
        }
      })
    };


    //토큰 유효 시간
    useEffect(() => {
      if(tokenData) {
        logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      }
    }, [tokenData, logoutHandler]);


    //컨택스트 value
    const contextValue = {
        token,
        userObj,
        isLoggedIn: userIsLoggedIn,
        isSuccess,
        isGetSuccess,
        getUser: getUserHandler,
        login: loginHandler,
        logout: logoutHandler,
    }

    
    // 컨택스트 내용 리턴
    return(
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );

}

export default AuthContext;
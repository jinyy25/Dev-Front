import { GET, POST }  from "../../contexts/fetch-action";


//0. 토큰생성
const createTokenHeader = (token: unknown) => {
  return {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
}

//1. 로그인 토큰 핸들러 (Set)
export const loginTokenHandler = (token:string, expirationTime:number) => {
  localStorage.setItem('token', token);
  localStorage.setItem('expirationTime', String(expirationTime));

  const remainingTime = calculateRemainingTime(expirationTime);
  return remainingTime;
}

//1-1 토큰 유지시간
const calculateRemainingTime = (expirationTime:number) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};


//2. 조회된 토큰 저장 (get)
export const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime') || '0';

  const remaingTime = calculateRemainingTime(+ storedExpirationDate);
  
  
  //유지시간
  if(remaingTime <= 1000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null
  }

  return {
    token: storedToken,
    duration: remaingTime
  }
}


//3. 로그인 액션 핸들러
export const loginActionHandler = (userId:string, userPw: string) => {
  const URL = '/auth/login';
  const loginObject = { userId, userPw };
  const response = POST(URL, loginObject, {});

  return response;
};


//4. 로그아웃 액션 핸들러
export const logoutActionHandler = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationTime');
};


//5. 유저정보
export const getUserActionHandler = (token: unknown) => {
  const URL = '/api/users/login';
  const response = GET(URL, createTokenHeader(token));
  return response;
}





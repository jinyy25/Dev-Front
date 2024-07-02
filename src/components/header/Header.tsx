import React, {useContext,useEffect,useState,useMemo} from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import UserPanel from '../user-panel/UserPanel';
import './Header.scss';
import { Template } from 'devextreme-react/core/template';
import type { HeaderProps } from '../../types';
import AuthContext from "../auth-store/auth-context";
import {jwtDecode} from "jwt-decode";
import {Popup} from "devextreme-react";
// import {useInterval} from "../time/worker.js";


interface DecodedToken {
  exp: number;
}

export default function Header({ menuToggleEnabled, title, toggleMenu }: HeaderProps) {

  const authCtx = useContext(AuthContext);
  const decodedToken: DecodedToken = jwtDecode(authCtx.token);
  const expirationTime = decodedToken.exp * 1000; // 만료 시간을 밀리초로 변환
  const [isPopupVisible, setPopupVisibility] = useState(false);

  const calculateRemainingTime = (timestamp: number) => {
    const currentTime = Date.now();
    const difference = Math.max(0, timestamp - currentTime);
    return Math.floor(difference / 1000); // 초 단위로 반환
  };

  const [time, setTime] = useState<number>(calculateRemainingTime(expirationTime));




  useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => {
              if (prevTime == 300) {
                  onPopRequest();
              }
              return prevTime - 1;
            });

        }, 1000);
      // authCtx.setClearTimer(timer);
    return () => clearInterval(timer);
  }, []);


  const formatTime = (seconds:number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };



  useEffect(()=>{
    if(authCtx.refreshSuccess ){
      window.location.reload();
    }
  },[authCtx.refreshSuccess])



  //7. 팝업 오픈
  const onPopRequest =()=>{
      setPopupVisibility(!isPopupVisible);
  }

  //8. 연장 요청
  const onApprovalRequest =  () =>{
     authCtx.refresh();
  }

  const logout = () =>{
      authCtx.logout();
  }

  //9. 팝업내용 (추후 화면 분리예정)
  const renderContent = () => {
      return (
          <>
              <div className="pop-button-outline">
                      <Button
                          width={100}
                          text="시간연장"
                          type="default"
                          stylingMode="contained"
                          className="margin-10"
                          onClick={onApprovalRequest}
                      />
                      <Button
                          width={100}
                          text="로그아웃"
                          type="default"
                          stylingMode="outlined"
                          onClick={logout}
                      />
              </div>
          </>
      )
  };

  return (
    <header className={'header-component'}>
      <Toolbar className={'header-toolbar'}>
        <Item
          visible={menuToggleEnabled}
          location={'before'}
          widget={'dxButton'}
          cssClass={'menu-button'}
        >
          <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
        </Item>
        <Item
          location={'before'}
          cssClass={'header-title'}
          text={title}
          visible={!!title}
        />
        <Item
          location={'after'}
          locateInMenu={'auto'}
          menuItemTemplate={'userPanelTemplate'}
        >
          <div className="header-outline">
            <Button
                onClick={onPopRequest}
                stylingMode={'text'}
            >
                {formatTime(time)}
            </Button>
            <div>
                  <Button
                    className={'user-button authorization'}
                    width={210}
                    height={'100%'}
                    stylingMode={'text'}
                  >
                  <UserPanel menuMode={'context'} />
                </Button>
              </div>
          </div>
        </Item>
        <Template name={'userPanelTemplate'}>
          <UserPanel menuMode={'list'} />
        </Template>
      </Toolbar>

      <Popup width={500} height={130}
             className="login-pop"
                  visible={isPopupVisible}
                  // hideOnOutsideClick={true}
                  contentRender={renderContent}
                  onHiding={onPopRequest}
                  showCloseButton={true}
                  dragEnabled={true}
                  position="center"
                  title="로그인연장"
              />
    </header>


)}
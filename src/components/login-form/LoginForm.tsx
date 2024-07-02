import React, { useState, useRef, useCallback, useContext  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
// import notify from 'devextreme/ui/notify';
// import { useAuth } from '../../contexts/auth';
import './LoginForm.scss';

import AuthContext from '../auth-store/auth-context';
import {Button} from "devextreme-react/button";
import {DataGridTypes} from "devextreme-react/data-grid";


// Login 시작
const  LoginForm = () => {

  let navigate = useNavigate();

  //0. Setting
  const [loading, setLoading] = useState(false);

  const formData = useRef({ userId: '', userPw: '' });
  const authCtx = useContext(AuthContext);




  //1. 로그인 버튼
  const onSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    
    // 기본변수
    const { userId, userPw } = formData.current;
    setLoading(true);

    await authCtx.login(userId, userPw);
    setLoading(false);

    if (authCtx.isSuccess) {
      navigate("/home");
    }

  };

  const onRequest = () => {
      navigate('/ask');
  }

  //2. Front
  return (
      <div>
    <form className={'login-form login-layout'} onSubmit={onSubmit}>
      <Form formData={formData.current} disabled={loading}>

        {/*입력폼*/}
        <Item
          dataField={'userId'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="사번을 다시 입력해주세요." />
          {/*<EmailRule message="유효하지 않은 사번입니다." />*/}
          <Label visible={false} />
        </Item>
        <Item
          dataField={'userPw'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="비밀번호를 다시 입력해주세요" />
          <Label visible={false} />
        </Item>

        {/*비밀번호 기억*/}
        {/*<Item*/}
        {/*  dataField={'rememberMe'}*/}
        {/*  editorType={'dxCheckBox'}*/}
        {/*  editorOptions={rememberMeEditorOptions}*/}
        {/*>*/}
        {/*  <Label visible={false} />*/}
        {/*</Item>*/}

        {/*button */}
        <ButtonItem>
          <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >

            {/*for loading*/}
            <span className="dx-button-text">
              {
                loading ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                  : 'Log In'
              }
            </span>
          </ButtonOptions>
        </ButtonItem>
      </Form>
    </form>

        <div className="bottom-outline">
          <div>
            <a className="a-round" href="http://trs.vtw.co.kr/">
              <Button className="button-round">TR System</Button>
            </a>
          </div>

          <div>
            <a className="a-round" href="https://outlook.office.com">
              <Button className="button-round">Mail</Button>
            </a>
          </div>

          <div>
               <Button className="button-round" onClick={onRequest} >디지털 서비스지원 질의응답</Button>
           </div>
        </div>

      </div>
  );
}

// 3. Front options
const emailEditorOptions = { stylingMode: 'filled', placeholder: '사번' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: '비밀번호', mode: 'password' };
// const rememberMeEditorOptions = { text: 'Remember me', elementAttr: { class: 'form-text' } };


export default LoginForm;
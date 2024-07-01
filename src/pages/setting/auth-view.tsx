import React, {useContext, useEffect, useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {POST} from "../../contexts/fetch-action";
import {Button} from "devextreme-react/button";
import {SelectBox} from "devextreme-react/select-box";
import {userType,manType,downType } from "./auth-data";
import AuthContext from "../../components/auth-store/auth-context";


export default function AuthView() {

    //0. Variables
    const navigate = useNavigate ();
    const location = useLocation();

    const authCtx = useContext(AuthContext);
    const userSeq = location.state && location.state.userSeq;
    const [result, setResult] = useState<any>();
    const [selectUserType, setSelectUserType] = useState("");
    const [selectManType, setSelectManType] = useState("");
    const [selectDownType, setSelectDownType] = useState("");

    //1. Onload
    useEffect(() => {
        searchSubmit();
    }, []);

    //2. Search
    const searchSubmit = () => {
        const response = POST("/api/setting/authview",{userSeq}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
              setResult(response?.data);
              setSelectUserType(response?.data.userType);
              setSelectManType(response?.data.manType);
              setSelectDownType(response?.data.downType);
          }).catch((error) =>{})
    }

    const saveButton =()=>{
        let body = {
            userSeq: userSeq,
            userType: selectUserType,
            manType: selectManType,
            downType: selectDownType
        }
        const response = POST("/api/setting/authsave",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            navigate('/setting')
        }).catch((error) =>{})
    }

    return(
        <React.Fragment>
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline flex-dir-col">

                    <div className="flex-space-option">
                        <div className="title-font">사원 정보</div>
                        <div className="padding-5">
                              <Button
                                width={100}
                                text="저장"
                                type="default"
                                stylingMode="contained"
                                className="margin-10"
                                 onClick={saveButton}
                              />
                             <Button
                                width={100}
                                text="이전"
                                type="default"
                                stylingMode="outlined"
                                 onClick={()=>navigate(-1)}
                              />
                        </div>
                    </div>

                </div>
            </div>

            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline flex-dir-col">
                    <table className="table table-bordered">
                            <colgroup>
                                <col width ="15%;"/>
                                <col width ="35%;"/>
                                <col width ="15%;"/>
                                <col width ="35%;"/>
                            </colgroup>

                            <thead>
                                <tr className="table-info">
                                    <th></th>
                                    <th>정보</th>
                                    <th></th>
                                    <th>설정</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className="td-title">이름</td>
                                    <td>{result?.userName}</td>
                                    <td className="td-title">기본권한</td>
                                                <td>
                                                    <SelectBox
                                                       dataSource={userType}
                                                       valueExpr="Category"
                                                       displayExpr="Category"
                                                       value={selectUserType}
                                                       onValueChanged={(e) => setSelectUserType(e.value)}
                                                    />
                                                </td>
                                </tr>
                                <tr>
                                    <td className="td-title">아이디</td>
                                    <td>{result?.userId}</td>
                                    <td className="td-title">인력관리</td>
                                    <td>
                                        <SelectBox
                                          dataSource={manType}
                                          valueExpr="Category"
                                          displayExpr="Category"
                                          value={selectManType}
                                          onValueChanged={(e) => setSelectManType(e.value)}
                                       />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="td-title">전화번호</td>
                                   <td>{result?.phone}</td>
                                    <td className="td-title">다운권한</td>
                                     <td>
                                         <SelectBox
                                           dataSource={downType}
                                           valueExpr="Category"
                                           displayExpr="Category"
                                           value={selectDownType}
                                           onValueChanged={(e) => setSelectDownType(e.value)}
                                         />
                                     </td>
                                </tr>
                            </tbody>

                        </table>

               </div>
            </div>
        </React.Fragment>
        )
}

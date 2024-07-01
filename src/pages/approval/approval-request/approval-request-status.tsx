import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import {jwtDecode} from "jwt-decode";
import DataGrid, {Column, DataGridTypes} from "devextreme-react/data-grid";
import AuthContext from "../../../components/auth-store/auth-context";



export default function ApprovalRequestStatus(){

    //0. Variables
    const [result,setResult] = useState<any[]>([]);
    const authCtx = useContext(AuthContext);

    //1. Onload
    useEffect(() => {
        searchSubmit();
    }, []);

    //2. Search
    const searchSubmit = () => {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        let userId: string | undefined = "";

        if (!decodedToken?.auth?.includes('ROLE_ADMIN')) {
            userId=decodedToken?.sub;
        }

        const response = POST("/api/reqdata/approval-request-list",{  userId:userId}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            setResult(response?.data);
         }).catch((error) =>{})
    }

    //3. 상세화면 이동
    const navigate = useNavigate();
    const onRowClick = (e: DataGridTypes.RowClickEvent) => {
        navigate('/search',{
            state: {
                fileCode: e.key ,
                type: 'H',
                pageState: 'V'
            }
        });
    }

    return(
        <React.Fragment>
            <div className={'content-block dx-card'}>
                <div className="title-padding">
                  <h4 className="card-title">승인요청현황</h4>
                </div>
            </div>
            <div className={'content-block dx-card responsive-paddings'}>
                <div>
                    <DataGrid dataSource={result.map((item, index) => ({ ...item, index: index + 1 }))}
                              showBorders={true} hoverStateEnabled={true}
                              keyExpr="fileCode"
                              onRowClick={onRowClick}
                              allowColumnResizing={true}>
                         <Column dataField="index" caption="번호" width='10%'/>
                         <Column dataField="fileName" caption="파일명" width='30%'/>
                         <Column dataField="reqCode" caption="상태" width='20%' />
                         <Column dataField="reqDesc" caption="사유" width='30%' />
                         <Column dataField="indt" caption="요청일시" width='15%' />
                   </DataGrid>
                </div>
             </div>
        </React.Fragment>
    )
}


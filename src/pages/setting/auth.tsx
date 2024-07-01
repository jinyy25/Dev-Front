import React, {useState, useEffect, useContext} from 'react';
import {POST} from "../../contexts/fetch-action";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import DataGrid, {Column, DataGridTypes, FilterRow, Pager, Paging} from "devextreme-react/data-grid";
import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import {Button} from "devextreme-react/button";
import AuthContext from "../../components/auth-store/auth-context";


export default function Auth(){

    //0. Variables
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [reqUserName,setUserName] = useState("");
    const [resultList, setResultList] = useState<any[]>([]);
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];

    //1. Onload
    useEffect(() => {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        searchSubmit();
    },[]);

    //2. Search
    const searchSubmit = () => {
        const response = POST("/api/setting/auth",{userName:reqUserName}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
         response.then((response)=>{
             setResultList(response?.data.searchResults)
         }).catch((error) =>{})
    };

    //3. onRowClick
    const onRowClick = (e: DataGridTypes.RowClickEvent) => {
        navigate('/viewsetting',{ state: { userSeq: +e.key } });
    }

    return(
        <React.Fragment>
                    <div className={'content-block dx-card padding-option'}>
                        <div className="dx-fieldset card-outline">
                            <Box direction="col" width="100%" height={150}>
                                <Item ratio={1}>
                                    <h4 className="card-title">권한설정</h4>
                                </Item>
                                <Item ratio={1} >
                                    <Box direction="row" width="100%" height={150}>
                                        <Item ratio={3}>
                                            <div className="dx-field">
                                                <div className="dx-field-label">이름</div>
                                                <div className="text-option">
                                                    <TextBox showClearButton={true} width="100%"
                                                    onValueChanged={(e) => setUserName(e.value)}
                                                    />
                                                </div>
                                            </div>
                                        </Item>
                                        <Item ratio={1}>
                                           <div className="dx-field buttons">
                                                 <div className="button-padding">
                                                   <Button
                                                     width={100}
                                                     text="검색"
                                                     type="default"
                                                     stylingMode="contained"
                                                     onClick={searchSubmit}
                                                   />
                                               </div>
                                             </div>
                                       </Item>
                                    </Box>
                                 </Item>
                            </Box>
                        </div>
                    </div>

                    <div className={'content-block dx-card responsive-paddings'}>
                      <DataGrid dataSource={resultList.map((item, index) => ({ ...item, index: index + 1 }))}
                                showBorders={true} hoverStateEnabled={true}
                                keyExpr="userSeq"
                                onRowClick={onRowClick}
                                allowColumnResizing={true}>

                             <FilterRow visible={true} />
                             <Paging defaultPageSize={10} />
                             <Pager visible={true}
                                     allowedPageSizes={allowedPageSizes}
                                     showPageSizeSelector={true}
                                     showInfo={true}
                                     showNavigationButtons={true} />

                             <Column dataField="index" caption="순번" width='8%'/>
                             <Column dataField="userId" caption="아이디"  width='12%'/>
                             <Column dataField="userName" caption="이름" width='15%' />
                             <Column dataField="userType" caption="메뉴권한" width='15%' />
                             <Column dataField="manType" caption="인력관리권한" width='15%' />
                             <Column dataField="downType" caption="다운로드권한" width='15%' />
                             <Column dataField="lastLogonTime" caption="최종접속시간" width='15%' />
                       </DataGrid>
                    </div>
        </React.Fragment>
    )
}

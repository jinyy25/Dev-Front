import React, { useState, useEffect, useContext} from 'react';
import {POST} from "../../../contexts/fetch-action";
import AuthContext from "../../../components/auth-store/auth-context";
import DataGrid, {Column, DataGridTypes, FilterRow, Pager, Paging} from "devextreme-react/data-grid";
import Box, {Item} from "devextreme-react/box";
import DateRangeBox from "devextreme-react/date-range-box";
import {Button} from "devextreme-react/button";
import {useNavigate} from "react-router-dom";


export default function Donwload(){


    //0. Variables
    const [resultList, setResultList] = useState<any[]>([]);
    const authCtx = useContext(AuthContext);
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), now.getMonth(), 1); // 올해의 1월 1일
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 현재 날짜의 23:59:59.999
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];
    const navigate = useNavigate();

    const initialValue: [Date, Date] = [startOfYear, endOfDay];
    const [selectedDays, setSelectedDays] = useState(initialValue);


    //1. Onload
    useEffect(() => {
        searchSubmit();
    }, []);


    //2. Search
    const searchSubmit = () => {
        let body = {
             reqSdate: selectedDays[0],
             reqEdate: selectedDays[1]
         }
        const response = POST("/api/stat/statdownload",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            setResultList(response?.data);
        }).catch((error) =>{})
    }

    //3. 상세화면 이동
    const onRowClick = (e: DataGridTypes.RowClickEvent) => {
        navigate('/search',{
            state: {
                fileCode: e.key,
                type: "D",
                pageState: 'V'
            }
        });
    }



    return(
        <React.Fragment>
            <div className={'content-block dx-card padding-option'}>
                      <div className="dx-fieldset card-outline">
                          <Box direction="col" width="100%" height={150}>
                              <Item ratio={1}>
                                  <h4 className="card-title">전체다운로드 현황</h4>
                              </Item>
                              <Item ratio={1} >
                                  <Box direction="row" width="100%" height={150}>
                                      <Item ratio={3}>
                                          <div className="dx-field">
                                              <div className="dx-field-label">조회기간</div>
                                            <div className="dx-field-value field-width">
                                                <DateRangeBox
                                                   defaultValue={initialValue}
                                                   value={selectedDays}
                                                   displayFormat="yyyy-MM-dd"
                                                   onValueChanged={(e) => setSelectedDays(e.value)}
                                                />
                                            </div>
                                          </div>
                                      </Item>
                                      <Item ratio={1}>
                                         <div className="dx-field buttons justify-option">
                                               <div className="button-padding">
                                                 <Button
                                                   width={100}
                                                   text="검색"
                                                   type="default"
                                                   stylingMode="contained"
                                                   onClick={()=>searchSubmit()}
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
                <DataGrid dataSource={resultList} showBorders={true} hoverStateEnabled={true}
                          onRowClick={onRowClick} keyExpr="fileCode">
                    <FilterRow visible={true} />
                           <Paging defaultPageSize={10} />
                            <Pager
                                visible={true}
                                allowedPageSizes={allowedPageSizes}
                                showPageSizeSelector={true}
                                showInfo={true}
                                showNavigationButtons={true} />
                           {/*<Column dataField="userId" caption="ID" width='8%'/>*/}
                           <Column dataField="userName" caption="사용자명" width='8%'/>
                           <Column dataField="ipAddress" caption="IP" width='13%' />
                           <Column dataField="projectName" caption="프로젝트명" width='22%' />
                           <Column dataField="fileName" caption="파일명" width='22%' />
                           <Column dataField="fileExt" caption="확장자" width='8%' />
                           <Column dataField="downloadTimestamp" caption="다운로드시간" width='15%' />
                           <Column dataField="roleDuration" caption="권한기간" width='15%' />
                     </DataGrid>
                 </div>
        </React.Fragment>
    )
}
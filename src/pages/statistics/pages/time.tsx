import React, {useContext, useEffect, useState} from 'react';
import {POST} from "../../../contexts/fetch-action";
import DataGrid, {Column, Pager, Paging} from "devextreme-react/data-grid";
import Box, {Item} from "devextreme-react/box";
import {Button} from "devextreme-react/button";
import DateRangeBox from "devextreme-react/date-range-box";
import AuthContext from "../../../components/auth-store/auth-context";



export default function Time(){

    //0. Variables
    const authCtx = useContext(AuthContext);
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 현재 날짜의 23:59:59.999

    const initialValue: [Date, Date] = [startOfYear, endOfDay];
    const [selectedDays, setSelectedDays] = useState(initialValue);
    const [resultList, setResultList] = useState<any[]>([]);


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
         const response = POST("/api/stat/stattime",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
               response.then((response)=>{
               setResultList(response?.data);
         }).catch((error) =>{})
     }

return(
    <React.Fragment>
        <div className={'content-block dx-card padding-option'}>
                  <div className="dx-fieldset card-outline">
                      <Box direction="col" width="100%" height={150}>
                          <Item ratio={1}>
                              <h4 className="card-title">접속시간대별 이용현황</h4>
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
                <DataGrid dataSource={resultList} showBorders={true} hoverStateEnabled={true}>
                    <Paging defaultPageSize={12} />
    
                       <Column dataField="dateTimes" caption="시간대" width='10%'/>
                       <Column dataField="totalCnt" caption="총건수" width='7%' />
                       <Column dataField="cnt1" caption="1월" width='7%' />
                       <Column dataField="cnt2" caption="2월" width='7%' />
                       <Column dataField="cnt3" caption="3월" width='7%' />
                       <Column dataField="cnt4" caption="4월" width='7%' />
                       <Column dataField="cnt5" caption="5월" width='7%' />
                       <Column dataField="cnt6" caption="6월" width='7%' />
                       <Column dataField="cnt7" caption="7월" width='7%' />
                       <Column dataField="cnt8" caption="8월" width='7%' />
                       <Column dataField="cnt9" caption="9월" width='7%' />
                       <Column dataField="cnt10" caption="10월" width='7%' />
                       <Column dataField="cnt11" caption="11월" width='7%' />
                       <Column dataField="cnt12" caption="12월" width='7%' />

                 </DataGrid>
             </div>
    </React.Fragment>
)
}

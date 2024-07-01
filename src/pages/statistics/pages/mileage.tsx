import React, { useContext, useEffect, useState} from 'react';
import {POST} from "../../../contexts/fetch-action";
import DataGrid, {Column,  Paging} from "devextreme-react/data-grid";
import Box, {Item} from "devextreme-react/box";
import {Button} from "devextreme-react/button";
import DateRangeBox from "devextreme-react/date-range-box";
import AuthContext from "../../../components/auth-store/auth-context";
import { PieChart,Series,Tooltip,Connector,Label  } from 'devextreme-react/pie-chart'

export default function Mileage(){
    const authCtx = useContext(AuthContext);
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // 올해의 1월 1일
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 현재 날짜의 23:59:59.999

    const [resultList, setResultList] = useState<any[]>([]);
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
            reqEdate: selectedDays[1],
        }
        const response = POST("/api/stat/statmileage",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
              response.then((response)=>{
              setResultList(response?.data);
        }).catch((error) =>{})
    }

    const onPointClick = (e:any) => {
      const point = e.target;
      if (point.isSelected()) {
        point.clearSelection();
      } else {
        point.select();
      }
    }

    const customizeText = (pointInfo:any) => {
      return pointInfo.value + " point";
    }

return(
    <React.Fragment>
        <div className={'content-block dx-card padding-option'}>
              <div className="dx-fieldset card-outline">
                  <Box direction="col" width="100%" height={150}>
                      <Item ratio={1}>
                          <h4 className="card-title">마일리지 현황</h4>
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
                                 <div className="dx-field buttons">
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
            <Box direction="row" width="100%" height={400}>
                <Item ratio={1}>
                    <div className="click-pointer">
                        <PieChart dataSource={resultList}
                                type="doughnut"
                                onPointClick={onPointClick}
                        >
                            <Series argumentField="userName"
                                    valueField="totalMileage">
                                <Label
                                  visible={true}
                                  position="columns"
                                  customizeText={customizeText}>
                                  <Connector visible={true}></Connector>
                                </Label>
                            </Series>
                        </PieChart>
                    </div>
                </Item>
                <Item ratio={0.1}></Item>
                <Item ratio={1}>
                    <DataGrid dataSource={resultList}   showBorders={true} hoverStateEnabled={true} >
                           <Paging defaultPageSize={10} />
                           <Column dataField="userName" caption="이름" width='30%'/>
                           <Column dataField="totalMileage" caption="마일리지"  width='30%'/>
                           <Column dataField="downCount" caption="다운로드" width='20%' />
                           <Column dataField="uploadCount" caption="업로드" width='20%' />
                    </DataGrid>
                </Item>
            </Box>
         </div>
    </React.Fragment>)
}

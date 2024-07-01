import React, { useContext, useEffect, useState} from 'react';
import FileGrid from "../grid/file-grid";
import {POST} from "../../../contexts/fetch-action";
import Box, {Item} from "devextreme-react/box";
import {Button} from "devextreme-react/button";
import DateRangeBox from "devextreme-react/date-range-box";
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';
import AuthContext from "../../../components/auth-store/auth-context";
import SearchContext from "../../search/store/search-context";


export default function File(){

    //0. Variables
    const authCtx = useContext(AuthContext);
    const searchCtx = useContext(SearchContext);

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // 올해의 1월 1일
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 현재 날짜의 23:59:59.999

    const [resultList, setResultList] = useState<any[]>([]);
    const initialValue: [Date, Date] = [startOfYear, endOfDay];
    const [selectedDays, setSelectedDays] = useState(initialValue);
    const [reqStypeCd, setStypeCd] = useState('');


    //1. Onload
     useEffect(() => {
         searchCtx.getStypeOptions(authCtx.token);
         searchSubmit();
     }, []);


    //3. Search
    const searchSubmit = () => {
        let body = {
            reqSdate: selectedDays[0],
            reqEdate: selectedDays[1],
            reqStype: reqStypeCd
        }
        const response = POST("/api/stat/statfile",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
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
                                  <h4 className="card-title">자료별 승인현황</h4>
                              </Item>
                              <Item ratio={1} >
                                  <Box direction="row" width="100%" height={150}>
                                      <Item ratio={3}>
                                          <div className="dx-field margin-option">
                                              <div className="dx-field-label">자료구분</div>
                                              <div className="text-option">
                                                  <Lookup
                                                   dataSource={searchCtx.stypeList}
                                                   valueExpr="stypeCd"
                                                   displayExpr="stypeNm"
                                                   showClearButton={true}
                                                   placeholder={"자료구분"}
                                                   onValueChanged={(e) => setStypeCd(e.value)}
                                                 >
                                                    <DropDownOptions showTitle={false} />
                                                  </Lookup>
                                              </div>
                                          </div>
                                      </Item>
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
                                                   width='10%'
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
                        <FileGrid visibleOption={false} pageCount={20} resultList={resultList}/>
                 </div>
        </React.Fragment>
    )
}

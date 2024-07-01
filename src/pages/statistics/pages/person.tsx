import React, { useState, useEffect, useContext} from 'react';
import {POST} from "../../../contexts/fetch-action";
import PersonGrid from "../grid/person-grid";
import Box, {Item} from "devextreme-react/box";
import {Button} from "devextreme-react/button";
import DateRangeBox from "devextreme-react/date-range-box";
import AuthContext from "../../../components/auth-store/auth-context";



export default function Person(){

    //0. Variables
    const authCtx = useContext(AuthContext);
    const [resultList, setResultList] = useState<any[]>([]);

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // 올해의 1월 1일
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 현재 날짜의 23:59:59.999

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
        const response = POST("/api/stat/statperson",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
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
                               <h4 className="card-title">개인별 승인현황</h4>
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
                                            <div className="button-padding ">
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
            <PersonGrid visibleOption={true} pageCount={20} resultList={resultList}/>
        </div>
    </React.Fragment>
)
}

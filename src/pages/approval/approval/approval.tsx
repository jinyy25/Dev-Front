import React, {useContext, useEffect, useState} from 'react';
import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import {Button} from "devextreme-react/button";
import DateRangeBox from "devextreme-react/date-range-box";
import ApprovalContext from "../store/approval-context";
import AuthContext from "../../../components/auth-store/auth-context";
import '../scss/approval.scss';


export default function Approval(){

    //0. Variables
    const authCtx = useContext(AuthContext);
    const approvalCtx = useContext(ApprovalContext);
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const initialValue: [Date, Date] = [startOfYear, endOfDay];
    const [selectedDays, setSelectedDays] = useState(initialValue);
    const [requestor,setRequestor] =useState("");

    //1. Onload
     useEffect(() => {
         searchSubmit();
     }, []);

    //2. Search
    const searchSubmit = () => {
        let body = {
            startDate: selectedDays[0],
            endDate: selectedDays[1],
            userName: requestor,
            reqTypeCd: null,
            reqCode: null,
            userId:null,
            rowCount:0
        }
        approvalCtx.getRequestList(body,authCtx.token);
    }
    

    return(
        <React.Fragment>
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline">
                    <Box direction="col" width="100%" height={150}>
                         <Item ratio={1} >
                             <h4 className="card-title">반출승인</h4>
                         </Item>
                        <Item ratio={1} >
                          <Box direction="row" width="100%" height={150}>
                              <Item ratio={1.5}>
                                  <div className="dx-field margin-option">
                                      <div className="dx-field-label">요청자</div>
                                      <div className="text-option">
                                          <TextBox
                                           showClearButton={true}
                                           width="100%"
                                           value={requestor}
                                           onValueChanged={(e) => setRequestor(e.value)}
                                          />
                                      </div>
                                  </div>
                              </Item>
                              <Item ratio={1.5}>
                                <div className="dx-field margin-option">
                                    <div className="dx-field-label">요청일자</div>
                                     <div className="dx-field-value field-width">
                                        <DateRangeBox
                                          defaultValue={initialValue}
                                          value={selectedDays}
                                          dateSerializationFormat="yyyy-MM-dd"
                                          displayFormat="yyyy-MM-dd"
                                          onValueChanged={(e) => setSelectedDays(e.value)}
                                        />
                                     </div>
                                </div>
                            </Item>
                              <Item ratio={0.5}>
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

        </React.Fragment>
    )
}

import React, {useContext, useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import {Button} from "devextreme-react/button";
import { Lookup, DropDownOptions } from 'devextreme-react/lookup';
import DateRangeBox from "devextreme-react/date-range-box";
import {SelectBox} from "devextreme-react/select-box";
import {StatusCategory} from "../data/status-data";
import AuthContext from "../../../components/auth-store/auth-context";
import SearchContext from "../../search/store/search-context";
import ApprovalContext from "../store/approval-context";



type Props = {
    type: string | undefined
}


const ApprovalComplete:React.FC<Props> = (props) => {

    //0. Variables
    const authCtx = useContext(AuthContext);
    const searchCtx = useContext(SearchContext);
    const approvalCtx = useContext(ApprovalContext);

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const initialValue: [Date, Date] = [startOfYear, endOfDay];
    const [selectedDays, setSelectedDays] = useState(initialValue);
    const [reqTypeCd, setStypeCd] = useState(0);
    const [reqCode, setReqCode] = useState(null);
    const [requestor,setRequestor] =useState("");

    //1. Onload
     useEffect(() => {
         searchCtx.getStypeOptions(authCtx.token);
         searchSubmit();
     }, []);

    //2. Search
    const searchSubmit =()=> {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        let userId: string | undefined = "";
        let rowCount=0;
        if (!decodedToken?.auth?.includes('ROLE_ADMIN')) userId = decodedToken?.sub;
        if(props.type=='H') rowCount=4

        let body = {
            startDate: selectedDays[0],
             endDate: selectedDays[1],
             userName: requestor,
             reqTypeCd: reqTypeCd,
             reqCode:reqCode,
             userId:userId,
             rowCount:rowCount
        }
        approvalCtx.getApprovalList(body,authCtx.token);
    }


    return(
        <React.Fragment>
            {props.type != 'H' && (
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline">
                    <Box direction="col" width="100%" height={200}>
                        <Item ratio={0.5} >
                            <h4 className="card-title">승인처리현황</h4>
                        </Item>
                       <Item ratio={1} >
                         <Box direction="row" width="100%" height={200}>
                             <Item ratio={1.5}>
                                 <div className="dx-field margin-option">
                                     <div className="dx-field-label">요청자</div>
                                     <div className="text-option">
                                         <TextBox showClearButton={true} width="100%"
                                                  value={requestor}
                                                  onValueChanged={(e) => setRequestor(e.value)}
                                         />
                                     </div>
                                 </div>
                             </Item>
                             <Item ratio={1.5}>
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
                           <Box direction="row" width="100%" height={200}>
                                <Item ratio={1.5}>
                                    <div className="dx-field margin-option">
                                        <div className="dx-field-label">상태구분</div>
                                        <div className="text-option">
                                            <SelectBox
                                            dataSource={StatusCategory}
                                            valueExpr="Index"
                                            displayExpr="Category"
                                            defaultValue={StatusCategory[0].Index}
                                            onValueChanged={(e) => setReqCode(e.value)}
                                            />
                                        </div>
                                    </div>
                                </Item>
                                <Item ratio={1.5}>
                                  <div className="dx-field margin-option">
                                      <div className="dx-field-label">요청기간</div>
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
                               <Item ratio={0.5}></Item>
                            </Box>
                      </Item>
                </Box>
                </div>
            </div>
            )}
        </React.Fragment>
    )
}


export default ApprovalComplete;
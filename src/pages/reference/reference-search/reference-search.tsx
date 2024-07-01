import React, { useContext, useEffect, useState} from 'react';
import ReferenceSearchGrid from "./reference-search-grid";
import {POST} from "../../../contexts/fetch-action";
import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import {Button} from "devextreme-react/button";
import AuthContext from "../../../components/auth-store/auth-context";



export default function ReferenceSearch(){

        //0. Variables
        const authCtx = useContext(AuthContext);
        const [reTitle, setRetitle] = useState("");
        const [resultList, setResultList] = useState<any[]>([]);

        //1. Onload
        useEffect(() => {
            searchSubmit();
        }, []);

        //2. Search
        const searchSubmit = () => {
            const response = POST("/api/reference/search",{titleFile:reTitle}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
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
                                  <h4 className="card-title">참고자료</h4>
                              </Item>
                              <Item ratio={1} >
                                  <Box direction="row" width="100%" height={150}>
                                      <Item ratio={3}>
                                          <div className="dx-field">
                                              <div className="dx-field-label">문서제목</div>
                                              <div className="text-option">
                                                  <TextBox showClearButton={true} width="100%"
                                                           value={reTitle}
                                                           onValueChanged={(e)=>setRetitle(e.value)}
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
                        <ReferenceSearchGrid visibleOption={false} pageCount={10} resultList={resultList} type={'R'}/>
                     </div>


            </React.Fragment>
        )
}

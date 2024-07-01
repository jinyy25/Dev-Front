import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import ReferenceSearchGrid from "../reference-search/reference-search-grid";
import {jwtDecode} from "jwt-decode";
import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import {Button} from "devextreme-react/button";
import AuthContext from "../../../components/auth-store/auth-context";


export default function UploadManagement(){

    //0. Variables
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [resultList, setResultList] = useState<any[]>([]);
    const [reTitle, setRetitle] = useState("");

    //1. Onload
    useEffect(() => {
        searchSubmit();
    }, []);

    //2. Search
    const searchSubmit = () => {
       const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
       let userId: string | undefined = '';
       if (decodedToken?.auth?.includes('ROLE_USER')) userId = decodedToken?.sub

       let body = {
           titleFile:reTitle,
           inid:userId
       }

       const response = POST("/api/reference/search",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
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
                                   <h4 className="card-title">자료관리</h4>
                               </Item>
                               <Item ratio={1} >
                                   <Box direction="row" width="100%" height={150}>
                                       <Item ratio={3}>
                                           <div className="dx-field">
                                               <div className="dx-field-label">제목</div>
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
                                                  />
                                              </div>
                                              <div className="button-padding">
                                                 <Button
                                                   width={100}
                                                   text="업로드"
                                                   type="default"
                                                   stylingMode="outlined"
                                                  onClick={()=>navigate('/reference/upload')}
                                                 />
                                             </div>
                                            </div>
                                      </Item>
                                   </Box>
                                </Item>
                           </Box>

                   </div>
               </div>

               <div className={'content-block dx-card padding-option'}>
                   <div className="dx-fieldset card-outline">
                       <ReferenceSearchGrid visibleOption={true} pageCount={10} resultList={resultList} type={'R'}/>
                   </div>
               </div>
           </React.Fragment>
    )
}
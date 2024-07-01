import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import NoticeListGrid from "./notice-list-grid";
import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import {Button} from "devextreme-react/button";
import AuthContext from "../../../components/auth-store/auth-context";


export default function NoticeList(){

    //0. Variables
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [titleFile,setTitleFile] =useState("")
    const [isButtonVisible, setIsButtonVisible] = useState(true);

    //1. Onload
    useEffect(() => {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        if (decodedToken?.auth?.includes('ROLE_ADMIN')) setIsButtonVisible(isButtonVisible);
        else setIsButtonVisible(!isButtonVisible);
    }, []);

    return(
        <React.Fragment>
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline">
                    <Box direction="col" width="100%" height={150}>
                        <Item ratio={1}>
                            <h4 className="card-title">공지사항</h4>
                        </Item>
                        <Item ratio={1} >
                            <Box direction="row" width="100%" height={150}>
                                <Item ratio={3}>
                                    <div className="dx-field">
                                        <div className="dx-field-label">제목</div>
                                        <div className="text-option">
                                            <TextBox showClearButton={true} width="100%"
                                                     value={titleFile}
                                                     onValueChanged={(e)=>setTitleFile(e.value)}/>
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
                                          <Button visible={isButtonVisible}
                                            width={100}
                                            text="글쓰기"
                                            type="default"
                                            stylingMode="outlined"
                                            onClick={()=>navigate('/uploadnotice')}/>
                                      </div>
                                     </div>
                               </Item>
                            </Box>
                         </Item>
                    </Box>
                </div>
            </div>

            <div className={'content-block dx-card responsive-paddings'}>
                <NoticeListGrid visibleOption={true} pageCount={10} search={titleFile} type={"N"}/>
            </div>
        </React.Fragment>
    )
}

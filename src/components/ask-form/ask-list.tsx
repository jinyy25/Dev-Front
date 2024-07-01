import React, {useContext, useEffect, useState} from 'react';
import FileGrid from "../../pages/statistics/grid/file-grid";

import {Button} from "devextreme-react/button";
import {useNavigate} from "react-router-dom";
import Editor from "../editor/editor";
import {POST} from "../../contexts/fetch-action";

import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import SelectBox from "devextreme-react/select-box";
import AskGrid from "./ask-grid"
import "./ask-layout.scss"

const  AskList = () => {


    //0. Variables
    const navigate = useNavigate()
    const [resultList, setResultList] = useState<any[]>([])
    const [title,setTitle] =useState("")

    //1. Onload
    useEffect(() => {searchSubmit()}, [])

    //2. Search
    const searchSubmit = () => {
        let body={
            askTitle:title,
        }

        const response = POST("/auth/ask/search",body, {});
        response.then((response)=>{
            setResultList(response?.data);
        }).catch((error) =>{})
    }

  return (
      <div>
          <div className={'content-block dx-card padding-option-ex'}>
              <div className="dx-fieldset card-outline padding-option-layout">
                  <Box direction="col" width="100%" height={150}>
                      <Item ratio={1}>
                          <h4 className="card-title">디지털 서비스지원 질의응답</h4>
                      </Item>
                      <Item ratio={1} >
                          <Box direction="row" width="100%" height={150}>
                              <Item ratio={3}>
                                  <div className="dx-field">
                                      <div className="dx-field-label">제목</div>
                                      <div className="text-option">
                                          <TextBox showClearButton={true} width="100%"
                                                   value={title}
                                                   onValueChanged={(e)=>setTitle(e.value)}/>
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
                                           className="margin-10"
                                           onClick={searchSubmit}
                                         />
                                           <Button
                                                width={100}
                                                text="Home"
                                                type="default"
                                                stylingMode="outlined"
                                                onClick={(e)=> navigate(-1)}
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
             <AskGrid resultList={resultList}/>
          </div>
      </div>
  );
}


export default AskList;
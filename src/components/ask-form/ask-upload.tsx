import React, {useContext, useState} from 'react';

import {Button} from "devextreme-react/button";
import {useNavigate} from "react-router-dom";
import Editor from "../editor/editor";
import {POST} from "../../contexts/fetch-action";
import EditorContext from "../editor/editor-context";

import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import "./ask-layout.scss"
import SelectBox from "devextreme-react/select-box";
import {optionType} from "./ask-data";

// Login 시작
const  AskUpoad = () => {
    //0. Variables
    const editorCtx = useContext(EditorContext);

    const navigate = useNavigate ();
    const [title,setTitle] =useState("");
    const [writer,setWriter] =useState("");
    const [email,setEmail] =useState("");
    const [selectOptionType, setSelectOptionType] = useState("");

    //1. 업로드
    const onClickUpload =()=>{
        var body={
            askTitle:title,
            askWriter:writer,
            askEmail:email,
            askDesc:editorCtx.editorContent,
            category:selectOptionType
        }
        const response = POST("/auth/ask/insert",body, {});
        response.then((response)=>{
            navigate("/ask")
        }).catch((error) =>{})
    }

    const onBackButton =()=>{
        navigate("/login");
    }

    return(
           <div className="outline-option-ex">
               <div className={'content-block dx-card responsive-paddings  scroll-option-1'}>

                   <div className="dx-fieldset card-outline ">
                                 <div className="flex-space-option">
                                     <div className="title-font">질의응답 작성</div>
                                     <div className="padding-5">
                                        <Button
                                          width={100}
                                          text="등록"
                                          type="default"
                                          stylingMode="contained"
                                           onClick={onClickUpload}
                                        />
                                         <Button
                                             className="margin-10"
                                             width={100}
                                             text="이전"
                                             type="default"
                                             stylingMode="outlined"
                                             onClick={(e)=> navigate(-1)}
                                         />
                                         <Button
                                            width={100}
                                            text="Home"
                                            type="default"
                                            stylingMode="outlined"
                                            onClick={onBackButton}
                                        />
                                     </div>
                                 </div>
                             </div>

                            <div className="dx-fieldset ">
                                <Box direction="col" height="500">
                                    <Item ratio={0.2}>
                                        <Box direction="row" height="100">
                                            <Item ratio={0.3}>
                                                <div className="dx-field">
                                                    <div className=" dx-field-label">작성자</div>
                                                    <TextBox showClearButton={true} width="200"
                                                             onValueChanged={(e)=>setWriter(e.value)}/>
                                                </div>
                                            </Item>

                                            <Item ratio={0.3}>
                                               <div className="dx-field">
                                                  <div className=" dx-field-label text-align-center">Email/Phone</div>
                                                  <TextBox showClearButton={true} width="200"
                                                           onValueChanged={(e)=>setEmail(e.value)}/>
                                              </div>
                                           </Item>

                                            <Item ratio={0.3}>
                                                <div className="dx-field">
                                                   <div className=" dx-field-label text-align-center">분류</div>
                                                    <div className="dx-field-value">
                                                    <SelectBox
                                                        dataSource={optionType}
                                                        placeholder="선택"
                                                        width={200}
                                                        valueExpr="Category"
                                                       displayExpr="Category"
                                                       value={selectOptionType}
                                                        onValueChanged={(e) => setSelectOptionType(e.value)}
                                                    />
                                                    </div>
                                               </div>
                                            </Item>

                                            {/*<Item ratio={0.3}>*/}
                                            {/*    <div className="dx-field">*/}
                                            {/*       <div className="dx-field-label">작성일</div>*/}
                                            {/*       <TextBox showClearButton={true} width="100%"*/}
                                            {/*                onValueChanged={(e)=>setTitle(e.value)}/>*/}
                                            {/*   </div>*/}
                                            {/*</Item>*/}
                                        </Box>
                                    </Item>
                                        <Item ratio={0.2}>
                                            <div className="dx-field">
                                                <div className="dx-field-label">제목</div>
                                                <TextBox showClearButton={true} width="100%"
                                                         onValueChanged={(e)=>setTitle(e.value)}/>
                                            </div>
                                        </Item>
                                        <Item ratio={1}>
                                            <div className="dx-field">
                                                <div className="dx-field-label">내용</div>
                                                <Editor visibleOption={true} height={450} />
                                            </div>
                                        </Item>
                                </Box>
                            </div>
                      </div>
            </div>
  );
}


export default AskUpoad;
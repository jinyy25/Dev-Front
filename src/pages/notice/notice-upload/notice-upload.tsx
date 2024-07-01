import React, { useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import Editor from "../../../components/editor/editor"
import {Button} from "devextreme-react/button";
import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import EditorContext from "../../../components/editor/editor-context";
import AuthContext from "../../../components/auth-store/auth-context";


export default function UploadNotice(){

    //0. Variables
    const editorCtx = useContext(EditorContext);
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate ();
    const [title,setTitle] =useState("");

    //1. 업로드
    const onClickUpload =()=>{
        var body={
            title:title,
            content:editorCtx.editorContent
        }
        const response = POST("/api/notice/insert",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            navigate("/notice")
        }).catch((error) =>{})
    }

    return(
           <React.Fragment>
               <div className={'content-block dx-card padding-option'}>
                    <div className="dx-fieldset card-outline flex-dir-col">
                        <div className="flex-space-option">
                            <div className="title-font">공지사항 작성</div>
                            <div className="padding-5">
                               <Button
                                 width={100}
                                 text="등록"
                                 type="default"
                                 stylingMode="contained"
                                 className="margin-10"
                                  onClick={onClickUpload}
                               />
                                <Button
                                    width={100}
                                    text="이전"
                                    type="default"
                                    stylingMode="outlined"
                                    onClick={(e)=> navigate(-1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

               <div className={'content-block dx-card padding-option'}>
                    <div className="dx-fieldset card-outline flex-dir-col">
                        <div className="dx-fieldset">
                            <Box direction="col" height="500">
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
                                        <Editor visibleOption={true} height={450}/>
                                    </div>
                                </Item>
                            </Box>
                        </div>
                  </div>
              </div>
           </React.Fragment>

    )
}
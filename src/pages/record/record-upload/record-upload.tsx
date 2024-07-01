import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import Editor from "../../../components/editor/editor";
import {Button} from "devextreme-react/button";
import Box, {Item} from "devextreme-react/box";
import TextBox from "devextreme-react/text-box";
import FileUploader from "devextreme-react/file-uploader";

import EditorContext from "../../../components/editor/editor-context"
import AuthContext from "../../../components/auth-store/auth-context";

export default function RecordUpload() {

    //0. Variables
    const authCtx = useContext(AuthContext);
    const editorCtx = useContext(EditorContext);
    const navigate = useNavigate ();

    const [uploadTitle,setUploadTitle] = useState("");
    const [recordFile, setRecordFile] = useState<File[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File[]>([]);

    //1. Upload
    const onClickUpdate = () =>{
        const formData = new FormData();
        formData.append('refile', recordFile[0]);
        formData.append('thumbnail', thumbnailFile[0]);
        formData.append('title', uploadTitle);
        formData.append('desc', editorCtx.editorContent);
        formData.append('typecode', "2");

        const response = POST("/api/upload",formData, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then(response => {
            navigate('/record')
        }).catch(error => {
             console.error("Error in fetching the file:", error);
        });

    }

    return(
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline flex-dir-col">
                    <div className="flex-space-option">
                        <div className="title-font">동영상 업로드</div>
                        <div className="padding-5">
                           <Button
                             width={100}
                             text="등록"
                             type="default"
                             stylingMode="contained"
                             className="margin-10"
                              onClick={()=> onClickUpdate()}
                           />
                            <Button
                                width={100}
                                text="이전"
                                type="default"
                                stylingMode="outlined"
                                 onClick={()=>navigate(-1)}
                              />
                        </div>
                    </div>

                    <div className="dx-fieldset">
                          <Box direction="col" height="850">
                              <Item ratio={0.2}>
                                  <div className="dx-field">
                                      <div className="dx-field-label">제목</div>
                                      <TextBox showClearButton={true} width="100%"
                                               value={uploadTitle}
                                               onValueChanged={(e)=>setUploadTitle(e.value)}
                                      />
                                  </div>
                              </Item>
                              <Item ratio={1}>
                                  <div className="dx-field">
                                      <div className="dx-field-label">내용</div>
                                      <Editor visibleOption={true} height={450}/>
                                  </div>
                              </Item>
                              <Item ratio={0.5}>
                                 <div className="dx-field">
                                     <div className="dx-field-label">첨부파일</div>
                                     <div className="fileuploader-container">
                                        <FileUploader selectButtonText="썸네일" accept="image/*" labelText="" uploadMode="useForm"
                                                      onValueChanged={(e) => setThumbnailFile(e.value ? e.value : [])}
                                        />
                                        <FileUploader selectButtonText="동영상파일" labelText="" uploadMode="useForm"
                                                      onValueChanged={(e) => setRecordFile(e.value ? e.value : [])}
                                        />
                                     </div>
                                 </div>
                              </Item>

                          </Box>
                      </div>
                </div>
            </div>
    )
}
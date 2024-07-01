import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import {jwtDecode} from "jwt-decode";
import Editor from "../../../components/editor/editor";
import Box, {Item} from "devextreme-react/box";
import {Button} from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import FileUploader from 'devextreme-react/file-uploader';
import AuthContext from "../../../components/auth-store/auth-context";
import EditorContext from "../../../components/editor/editor-context";
import '../scss/reference.scss';


export default function UploadManagement(){

    //0. Variables
    const authCtx = useContext(AuthContext);
    const editorCtx = useContext(EditorContext);

    const navigate = useNavigate ();
    const [uploadTitle,setUploadTitle] = useState("");
    const [recordFile, setRecordFile] = useState<File[]>([]);

    //1. Upload
    const onClickUpload =()=>{
        if(!recordFile[0]){
            alert("첨부파일을 추가해주세요")
            return false;
        }


        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        const inid = decodedToken?.sub as string;

        const formData = new FormData();
        if (recordFile[0]) formData.append('refile',  recordFile[0]);
        else formData.append('refile',  "");
        formData.append('title', uploadTitle);
        formData.append('desc', editorCtx.editorContent);
        formData.append('typecode', "1");
        formData.append('inid', inid);

        const response = POST("/api/upload",formData, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then(response => {
                navigate('/profile')
        }).catch(error => {
             console.error("Error in fetching the file:", error);
        });
    }

    return(
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline flex-dir-col">
                    <div className="flex-space-option">
                        <div className="title-font">참고자료 업로드</div>
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
                                 onClick={()=>navigate(-1)}
                              />
                        </div>
                    </div>

                    <div className="dx-fieldset">
                          <Box direction="col" height="650">
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
                              <Item ratio={0.2}>
                                 <div className="dx-field">
                                     <div className="dx-field-label">첨부파일</div>
                                     <div className="fileuploader-container">
                                        <FileUploader selectButtonText="첨부파일" labelText="" uploadMode="useForm"
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
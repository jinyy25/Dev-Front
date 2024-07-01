import React, {useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {POST} from "../../../contexts/fetch-action";
import Editor from "../../../components/editor/editor";
import {HtmlEditor} from "devextreme-react";
import {Button} from "devextreme-react/button";
import AuthContext from "../../../components/auth-store/auth-context";
import EditorContext from "../../../components/editor/editor-context";
import ReferencePdfView from "./reference-pdf-view";
import ReferenceHwpView from "./reference-hwp-view";



const ReferenceView = () => {

        //0. Variables
        const authCtx = useContext(AuthContext);
        const editorCtx = useContext(EditorContext);

        const navigate = useNavigate ();
        const location = useLocation();
        const fileCode = location.state && location.state.fileCode;
        const type = location.state && location.state.type;

        const [result, setResult] = useState<any>();
        const [isVisible, setIsVisible] = useState(false);
        const [titleFile, setTitleFile] = useState("");
        const [inid, setInid] = useState("");
        const [isReadOnly, setIsReadOnly] = useState(false); // readonly 상태를 저장하는 상태

        const createTokenHeader = (token:string) => {
            return {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
                ,responseType: 'arraybuffer'
            }
        }

        //1. Onload
        useEffect(() => {
            searchSubmit(fileCode);
        }, [fileCode]);

        //2. Search
        const searchSubmit = (fileCode: any) => {
            const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
            const response = POST("/api/reference/detail",{fileCode},{headers: {'Authorization': 'Bearer ' + authCtx.token}});
            response.then(response => {

                setResult(response?.data);
                setTitleFile(response?.data.titleFile);
                setInid(response?.data.inid);

                editorCtx.setEditor(response?.data.descFile);
                if (type === 'P' && (decodedToken?.sub === response?.data?.inid)){
                    setIsVisible(!isVisible);
                    setIsReadOnly(false);
                } else {
                    setIsVisible(!!isVisible);
                    setIsReadOnly(true);
                }
            })
        }

        //3. 파일다운로드
        const handleDownload = () => {
            const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
            let saveName = result?.saveName;
            let body={
                fileName:saveName,
                type:4
            }

            const response = POST("/file/download",body, createTokenHeader(authCtx.token));
            response.then(response => {
                if (response && response.data) {
                    const blob = new Blob([response.data], { type: 'application/octet-stream' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = result?.fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } else {
                    console.error("Error in response or data is null");
                }

                if(inid != decodedToken?.sub){
                    downloadCount();
                }

            }).catch(error => {
                console.error("Error in fetching the file:", error);
            });

        };
        //다운로드 카운트
        const downloadCount =()=>{
            var body = {
                inid:result.inid,
                fileCode:fileCode,
                downCnt:result.downCnt +1
            }
           POST("/api/reference/downloadCount",body,{headers:{'Authorization': 'Bearer ' + authCtx.token}});
        }

    //3. Update
    const onClickUpdate =()=> {

        var body ={
            titleFile: titleFile,
            descFile: editorCtx.editorContent,
            fileCode: fileCode
        }

        const response = POST("/api/reference/update",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            navigate("/profile")
        }).catch((error) =>{})
    }

    //4. Delete
    const onClickDelete =()=>{
        const response = POST("/api/reference/delete",{fileCode}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            navigate("/profile")
        }).catch((error) =>{})
    }



        return(
            <React.Fragment>
                <div className={'content-block dx-card padding-option'}>
                    <div className="dx-fieldset card-outline flex-dir-col">
                        <div className="flex-space-option">
                            <div className="title-font">
                                참고자료
                            </div>

                            <div className="padding-5">
                                <Button
                                     width={100}
                                     text="수정"
                                     type="default"
                                     stylingMode="contained"
                                     onClick={onClickUpdate}
                                     visible={isVisible}
                                   />
                                  <Button
                                     width={100}
                                     text="삭제"
                                     type="default"
                                     stylingMode="contained"
                                     className="margin-10"
                                      onClick={onClickDelete}
                                     visible={isVisible}
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

                        <table className="table table-bordered table-padding-1">
                            <colgroup>
                                <col width="8%"/>
                                <col width='13%'/>
                                <col width='8%'/>
                                <col width='13%'/>
                                <col width='8%'/>
                                <col width='13%'/>
                                <col width='8%'/>
                                <col width='13%'/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td className="td-title">작성자</td>
                                <td>{result?.userName}</td>
                                <td className="td-title">등록일자</td>
                                <td>{result?.indt}</td>
                                <td className="td-title">조회수</td>
                                <td>{result?.viewCnt}</td>
                                <td className="td-title">다운로드수</td>
                                <td>{result?.downCnt}</td>
                            </tr>
                            <tr>
                                <td className="td-title">파일명</td>
                                <td colSpan={5}  className="align-left">{result?.fileName}</td>
                                <td className="td-title">다운로드</td>
                                <td>
                                    <Button height={20}
                                            width={100}
                                            type="default"
                                            stylingMode="contained"
                                            text="다운로드"
                                            onClick={()=>handleDownload()}/>
                                </td>
                            </tr>
                            <tr>
                                <td className="td-title">제목</td>
                                <td colSpan={8} className="td-white-space">
                                    <textarea className="input-option text-option"
                                           defaultValue={result?.titleFile}
                                           onChange={(e)=>setTitleFile(e.target.value)}
                                           readOnly={isReadOnly}
                                    />
                                </td>
                            </tr>       
                            <tr>
                                <td className="td-title">내용</td>
                                <td colSpan={8} className="td-cell cell-padding align-none">
                                    {isVisible ? (
                                        <Editor visibleOption={true} height={400} />):
                                        (<div className="editor-custom">
                                            <HtmlEditor height={200} readOnly={true} value={result?.descFile}/>
                                        </div>)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={'content-block dx-card'}>
                    <div className="card-outline">
                        {(result?.fileExt ==="hwp") &&(<ReferenceHwpView tmpName={result?.tmpName}/>)}
                        {(["ppt", "pptx", "pdf"].includes(result?.fileExt)) && <ReferencePdfView tmpName={result?.tmpName} fileExt={result?.fileExt}/>}
                         {/*{(searchCtx.fileDetail?.fileExt === "pptx" || searchCtx.fileDetail?.fileExt === "pdf")  &&(<TempPdfView/>)}*/}
                     </div>
                </div>

            </React.Fragment>
        )
    }




export default ReferenceView;
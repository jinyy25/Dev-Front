import React, {useContext, useState, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import Editor from "../../../components/editor/editor";
import {jwtDecode} from "jwt-decode";
import {Button} from "devextreme-react/button";
import HtmlEditor from 'devextreme-react/html-editor';
import ReactPlayer from 'react-player';
import AuthContext from "../../../components/auth-store/auth-context";
import EditorContext from "../../../components/editor/editor-context";

interface DataItem {
    fileCode: number
    , titleFile: string
    , saveName: string
    , saveThumbname: string
    , indt: string
    , descFile: string
    , typeFile: string
}

export default function RecordView() {

    //0. Variables
    const authCtx = useContext(AuthContext);
    const editorCtx = useContext(EditorContext);

    const navigate = useNavigate ();
    const location = useLocation();
    const fileCode = location.state && location.state.fileCode;

    const [recordDetail,setRecordDetail] = useState<DataItem>();
    const [recordFile,setRecordFile]=useState("");

    const [updateTitle,setUpdateTitle] =useState("");
    const [isVisible, setIsVisible] = useState(false);

    //마우스 우클릭 방지
    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => event.preventDefault()

    //1. Onload
    useEffect(() => {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        if (decodedToken?.auth?.includes('ROLE_ADMIN')) {
            setIsVisible(!isVisible);
         }else{
            setIsVisible(!!isVisible);
         }

        searchSubmit();
    }, []);

    //2. Search
    const searchSubmit = () => {
        const response = POST("/api/record/detail",{fileCode}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then(response => {
            var saveName="/api/videos/"+response?.data.saveName;
            setRecordDetail(response?.data);
            setRecordFile(saveName);
            setUpdateTitle(response?.data.titleFile);
            editorCtx.setEditor(response?.data.descFile);
        }).catch(error => {
          console.error("Error in fetching the file:", error);
        });
    }

    //3. Delete
    const onClickDelete = () =>{
        const response = POST("/api/record/delete",{ fileCode: fileCode }, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((res)=>{
            navigate('/record')
        })
        .catch((error)=>{
           console.log(error);
        })
    }

    //4. Update
    const onClickUpdate = () =>{
        var body={
            fileCode: fileCode,
            titleFile: updateTitle,
            descFile: editorCtx.editorContent
        }
        const response = POST("/api/record/update",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((res)=>{
             navigate('/record')
         })
         .catch((error)=>{
            console.log(error);
         })
    }

    return(
        <React.Fragment>
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline flex-dir-col">

                    <div className="flex-space-option">
                        <div className="title-font">동영상자료</div>

                        <div className="padding-5">
                            <Button
                               width={100}
                               text="수정"
                               type="default"
                               stylingMode="contained"
                               visible={isVisible}
                               onClick={()=> onClickUpdate()}
                             />
                            <Button
                               width={100}
                               text="삭제"
                               type="default"
                               stylingMode="contained"
                               className="margin-10"
                               visible={isVisible}
                               onClick={()=> onClickDelete()}
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

                    <table className="table table-bordered border-top-none">
                         <colgroup>
                              <col width="10%"/>
                              <col width='20%'/>
                              <col width='10%'/>
                              <col width='20%'/>
                             <col width='10%'/>
                             <col width='20%'/>
                          </colgroup>

                         <tbody>
                             <tr>
                                 <td className="td-title">제목</td>
                                 <td className="td-cell cell-padding">
                                     <textarea className="text-option"
                                               rows={1}
                                               value={updateTitle}
                                               disabled={!isVisible}
                                               onChange={(e)=>setUpdateTitle(e.target.value)
                                               }
                                     />
                                 </td>
                                 <td className="td-title">분류</td>
                                 <td className="td-cell">
                                     {recordDetail?.typeFile}
                                 </td>
                                 <td className="td-title">작성일자</td>
                                  <td className="td-cell">
                                      {recordDetail?.indt}
                                  </td>
                             </tr>
                             <tr>
                                 <td className="td-title">내용</td>
                                 <td colSpan={5} className="td-cell cell-padding align-none">
                                     {/*권한에따라 Editor 오픈*/}
                                     {isVisible ? (<Editor visibleOption={false} height={200}/>
                                            ): (<div className="editor-custom">
                                        <HtmlEditor height={150} readOnly={true} value={editorCtx.editorContent}/> </div>)}
                                 </td>
                             </tr>
                         </tbody>

                     </table>
                </div>

                <div className="record-view" key={recordFile} onContextMenu={handleContextMenu}>
                    <ReactPlayer
                          url={recordFile}
                          width="100%"
                          height="480"
                          controls={true}
                          config={{
                            file: {
                              attributes: {
                                controlsList: 'nodownload', // 다운로드 버튼 비활성화
                              },
                            },
                          }}
                        />

                </div>
            </div>



        </React.Fragment>
    )
}
import React, {useContext, useEffect, useState} from 'react';
import {Button} from "devextreme-react/button";
import {POST} from "../../../contexts/fetch-action";
import {useLocation, useNavigate} from "react-router-dom";
import Editor from "../../../components/editor/editor";
import {jwtDecode} from "jwt-decode";
import {HtmlEditor} from "devextreme-react";
import AuthContext from "../../../components/auth-store/auth-context";
import EditorContext from "../../../components/editor/editor-context";

export default function NoticeView() {

    //0. Variables
    const authCtx = useContext(AuthContext);
    const editorCtx = useContext(EditorContext);

    const navigate = useNavigate ();
    const location = useLocation();
    const boardId = location.state && location.state.boardId;

    const [result, setResult] = useState<any>();
    const [title,setTitle] =useState("");
    const [isVisible, setIsVisible] = useState(false);

    //1. Onload
    useEffect(() => {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        if (decodedToken?.auth?.includes('ROLE_ADMIN')) setIsVisible(!isVisible);
        else setIsVisible(!!isVisible);
        searchSubmit();
    }, []);

    //2. Search
    const searchSubmit = () => {
        const response = POST("/api/notice/view",{boardId}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
              setResult(response?.data);
              setTitle(response?.data.title);
              editorCtx.setEditor(response?.data.content);
          }).catch((error) =>{})
    }

    //3. Update
    const onClickUpdate =()=> {
        var body ={
            title:title,
            content:editorCtx.editorContent,
            boardId:boardId
        }
        const response = POST("/api/notice/update",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            navigate("/notice")
        }).catch((error) =>{})
    }

    //4. Delete
    const onClickDelete =()=>{
        const response = POST("/api/notice/delete",{boardId}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            navigate("/notice")
        }).catch((error) =>{})
    }

    return(
        <React.Fragment>
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline flex-dir-col">

                    <div className="flex-space-option">
                        <div className="title-font">공지사항</div>
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
                                 onClick={(e)=>navigate(-1)}
                              />
                        </div>
                    </div>
                        <table className="table table-bordered">

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
                                           <th className="td-title">작성자</th>
                                           <td>{result?.writer}</td>
                                           <th className="td-title">등록일</th>
                                           <td>{result?.indt}</td>
                                           <th className="td-title">수정일</th>
                                           <td>{result?.updt}</td>
                                       </tr>
                                       <tr>
                                           <th className="td-title">제목</th>
                                           <td className="td-cell cell-padding" colSpan={5}>
                                               <textarea
                                                className="text-option" rows={1}
                                                defaultValue={result?.title}
                                                onChange={(e)=>setTitle(e.target.value)}
                                              />
                                           </td>
                                       </tr>
                                       <tr>
                                           <th className="td-title">내용</th>
                                           <td colSpan={5} className="td-cell cell-padding align-none">
                                               {isVisible ? (
                                                   <Editor visibleOption={true} height={500} />) :
                                                   (<div className="editor-custom"><HtmlEditor height={500} readOnly={true} value={result?.content}/></div>)}
                                            </td>
                                       </tr>
                                   </tbody>
                       </table>
                </div>
            </div>
        </React.Fragment>
    )

}
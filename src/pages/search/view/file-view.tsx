import React, { useContext, useEffect, useState} from 'react';
import PdfView from "./pdf-view";
import HwpView from "./hwp-view";
import {useLocation, useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import {jwtDecode} from "jwt-decode";
import {Button} from "devextreme-react/button";
import TextArea from 'devextreme-react/text-area';
import {Popup} from "devextreme-react";
import SearchContext from "../store/search-context";
import AuthContext from "../../../components/auth-store/auth-context";



const FileView = () => {

        //0. Variables
        const navigate = useNavigate ();
        const location = useLocation();
        const fileCode = location.state && location.state.fileCode;
        const type = location.state && location.state.type;

        const [convertMulti, setConvertMulti] = useState<string[]>([]);
        const [originalMulti, setOriginalMulti] = useState<string[]>([]);
        const authCtx = useContext(AuthContext);
        const searchCtx = useContext(SearchContext);
        const [isPopupVisible, setPopupVisibility] = useState(false);
        const [reqDesc,setReqDesc] =useState("");

        const [totalBtn, setTotalBtn] = useState(false);
        const [componentToRender, setComponentToRender] = useState<JSX.Element | null>(null);

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


        useEffect(() => {
            if(searchCtx.exportedIndexes !== undefined){
                const transformedArray = searchCtx.exportedIndexes.map(item => {
                    const [index] = item.split('_');
                    return index + '_PPTX';
                });
                setConvertMulti(transformedArray);
                setOriginalMulti(searchCtx.exportedIndexes);
            }
        }, [searchCtx.exportedIndexes]);


        //2. Search
        const searchSubmit = (fileCode: any) => {
            const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
            if (decodedToken?.auth?.includes('ROLE_ALL') || decodedToken?.auth?.includes('ROLE_DOWNLOAD')
                || decodedToken?.auth?.includes('ROLE_ADMIN')
            ) {
                setTotalBtn(true);
            }

            var body ={
                fileCode:fileCode,
                userId : decodedToken?.sub
            }
            searchCtx.getFileInfo(body,authCtx.token);

        }


        //3. 목록으로
        const handleGoBack = () => {
            searchCtx.resetHandler();
            searchCtx.setAutoOption(true);
            if(type == "H" || type == "D"){
                navigate(-1);
            }else{
                navigate('/search',
                    {
                        state: {
                            page: 'B',
                            fileCode:fileCode
                        }
                    });
            }
        };


        //4. 파일다운로드
        const handleDownload = () => {
            var typeCategory = 0;
            var newFileName = "";
            var fileExt = searchCtx.fileDetail?.fileExt;
            var projectName = searchCtx.fileDetail?.projectName;
            var fileCode = searchCtx.fileDetail?.fileCode;
            const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;

            if(fileExt ==='pdf'){
                typeCategory =1;
                newFileName = projectName+".pdf";
            }else if (fileExt ==='hwp'){
                typeCategory =3;
                newFileName = projectName+".hwp";
            }else if (fileExt ==='pptx'){
                typeCategory =1;
                newFileName = projectName+".pptx";
            }

            var body={
                projectName:projectName,
                // fileName:tmpName,
                fileName:searchCtx.fileDetail?.saveName,
                type:typeCategory,
                userId : decodedToken?.sub,
                fileExt: fileExt,
                fileCode: fileCode

            }

            const response = POST("/file/download",body, createTokenHeader(authCtx.token));
            response.then(response => {
                if (response && response.data) {
                    const blob = new Blob([response.data], { type: 'application/octet-stream' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = newFileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } else {
                    console.error("Error in response or data is null");
                }
            }).catch(error => {
                console.error("Error in fetching the file:", error);
            });

        };

        //5. 멀티 다운로드
        const handleMultiDownload = (originalMulti:string[]) => {
            let saveName: string | undefined = searchCtx.fileDetail?.saveName;
            let projectName: string | undefined = searchCtx.fileDetail?.projectName;
            let saveNameWithoutExtension = null;
            if (saveName !== undefined) saveNameWithoutExtension = saveName.substring(0, saveName.lastIndexOf("."));
            let newFileName = searchCtx.fileDetail?.projectName+".pptx";    //새로운 파일명

            if(originalMulti.length>5){
                alert("5건 이하만 선택가능합니다.")
                return false;
            }else if(originalMulti.length==0){
                alert("다운로드 받고자 하는 페이지의 체크박스를 선택해주세요.")
                return false;
            }

            let body={
                pptxArray :originalMulti,
                fileName :saveNameWithoutExtension,
                projectName :projectName
            }


            const response = POST("/file/downloadMulti",body, createTokenHeader(authCtx.token));
            response.then(response => {
                if (response && response.data) {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = newFileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout((_) => {
                    window.URL.revokeObjectURL(url);
                    }, 1000);
                    a.remove();

                    // deletefile 값 추출
                    const contentDispositionHeader = response.headers['content-disposition'];
                    const deletefileMatch = contentDispositionHeader.match(/deletefile=([^;]+)/);
                    const deletefile = deletefileMatch ? deletefileMatch[1] : null;

                    //다운로드후 만들어진 파일 삭제
                    handleDeleteFile(deletefile);
                } else {
                    console.error("Error in response or data is null");
                }
            }).catch(error => {
                console.error("Error in fetching the file:", error);
            });
        }

        //6. 병합된 파일 삭제
        const handleDeleteFile =(fileName:string)=> POST("/file/delete",{fileName},{headers: {'Authorization': 'Bearer ' + authCtx.token}});

        //7. 팝업 오픈
        const onPopRequest =()=>{
            setPopupVisibility(!isPopupVisible);
            setReqDesc("제안서 작성 시에 필요합니다.");
        }

        //8. 승인요청
        const onApprovalRequest = () =>{
            const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;

            let body={
                reqDesc:reqDesc,
                fileCode:fileCode,
                inid:decodedToken?.sub,
                userSeq:authCtx.userObj.userSeq
            }

            const response = POST("/api/reqdata/request",body,{headers: {'Authorization': 'Bearer ' + authCtx.token}});
            response.then(response => {
                navigate('/search',{ state: {page: 'B' } });
            })
        }

        //9. 팝업내용 (추후 화면 분리예정)
        const renderContent = () => {
            return (
                <>
                    <div>요청사유를 적어주세요</div>

                    <TextArea
                        className="pop-content"
                        height={100}
                        maxLength={100}
                        showClearButton={true}
                        value={reqDesc}
                        onValueChanged={(e) => setReqDesc(e.value)}
                    />

                    <div className="pop-button-outline">
                            <Button
                                width={80}
                                text="확인"
                                type="default"
                                stylingMode="contained"
                                className="margin-10"
                                onClick={onApprovalRequest}
                            />
                            <Button
                                width={80}
                                text="취소"
                                type="default"
                                stylingMode="outlined"
                                onClick={onPopRequest}
                            />
                    </div>
                </>
            )
        };


        useEffect(() => {
               if (searchCtx.fileDetail) {
                   if (searchCtx.fileDetail.fileExt === "hwp") {
                       setComponentToRender(<HwpView saveName={searchCtx.fileDetail.saveName} />);
                   } else if (searchCtx.fileDetail.fileExt === "ppt" || searchCtx.fileDetail.fileExt === "pptx" || searchCtx.fileDetail.fileExt === "pdf") {
                       setComponentToRender(<PdfView visibleOption={totalBtn} />);
                   }
               }
           }, [searchCtx.fileDetail]);

        /*Rendering*/
        return(
            <React.Fragment>
                <div className={'content-block dx-card padding-option'}>
                    <div className="dx-fieldset card-outline flex-dir-col">

                        <div className="flex-space-option">
                            <div className="title-font">
                                문서정보
                            </div>

                            <div className="padding-5">
                                {!searchCtx.fileDetail?.reqCode && !totalBtn && (
                                    <Button
                                        width={100}
                                        text="승인요청"
                                        type="default"
                                        stylingMode="contained"
                                        className="margin-10"
                                        onClick={onPopRequest}
                                    />)
                                }
                                <Button
                                    width={100}
                                    text="이전"
                                    type="default"
                                    stylingMode="outlined"
                                    onClick={handleGoBack}
                                />
                            </div>
                        </div>

                        <table className="table table-bordered table-padding-1">
                            <colgroup>
                                <col width="7%"/>
                                <col width='17%'/>
                                <col width='7%'/>
                                <col width='17%'/>
                                <col width='7%'/>
                                <col width='17%'/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td className="td-title">발주기관</td>
                                <td>{searchCtx.fileDetail?.organiName}</td>
                                <td className="td-title">자료구분</td>
                                <td>{searchCtx.fileDetail?.typeFile}</td>
                                <td className="td-title">사업연도</td>
                                <td className="td-white-space">{searchCtx.fileDetail?.projectYear}</td>
                            </tr>
                            <tr>
                                <td className="td-title">프로젝트</td>
                                <td colSpan={3} className="td-white-space">{searchCtx.fileDetail?.projectName}</td>
                                <td className="td-title">등록일자</td>
                                <td>{searchCtx.fileDetail?.indt}</td>
                            </tr>
                            <tr>
                                <td className="td-title">파일명</td>
                                <td colSpan={3} className="td-white-space">
                                    {searchCtx.fileDetail?.fileName}
                                </td>
                                <td className="td-title">승인상태 </td>
                                <td>
                                    {(() => {
                                        switch (searchCtx.fileDetail?.reqCode) {
                                            case 1:
                                                return '요청중';
                                            case 2:
                                                return '요청취소';
                                            case 3:
                                                if (searchCtx.fileDetail?.fileExt =="pdf"||searchCtx.fileDetail?.fileExt =="hwp"||totalBtn) {
                                                    return (<Button height={25}
                                                                    width={130}
                                                                    type="default"
                                                                    stylingMode="contained"
                                                                    text="전체 다운로드"
                                                                    onClick={()=>handleDownload()}/>);
                                                }else if(searchCtx.fileDetail?.fileExt === "ppt" ||searchCtx.fileDetail?.fileExt =="pptx"){
                                                    return (<Button height={25}
                                                                    width={130}
                                                                    type="default"
                                                                    stylingMode="contained"
                                                                    text="다건 다운로드"
                                                                    onClick={()=>handleMultiDownload(originalMulti)}/>);}
                                                break;
                                            case 4:
                                                return '반려';
                                            default:
                                                if(totalBtn){
                                                    return(<Button height={25}
                                                            width={170}
                                                            type="default"
                                                            stylingMode="contained"
                                                            text="전체 다운로드 [PPT]"
                                                            onClick={()=>handleDownload()}/>)
                                                }else{
                                                    return '요청전';
                                                }
                                        }
                                    })()}

                                </td>
                            </tr>
                            {convertMulti.length > 0 && (
                                <tr>
                                    <td className="td-title">PPT</td>
                                    <td colSpan={6}>
                                        <div className="flex-wrap flex-option" >
                                            {convertMulti.map((result, index) => {
                                                return (
                                                    <label key={index} className="addedLabel">
                                                        {result}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/*<div className={'content-block dx-card'}>*/}
                {/*    <div className="card-outline">*/}
                {/*        {(searchCtx.fileDetail?.fileExt ==="hwp") &&(<HwpView saveName={searchCtx.fileDetail?.saveName}/>)}*/}
                {/*        {(searchCtx.fileDetail?.fileExt === "ppt" || searchCtx.fileDetail?.fileExt === "pptx" || searchCtx.fileDetail?.fileExt === "pdf")*/}
                {/*        && <PdfView visibleOption={totalBtn}/>}*/}
                {/*        /!*{(searchCtx.fileDetail?.fileExt === "pptx" || searchCtx.fileDetail?.fileExt === "pdf")  &&(<TempPdfView/>)}*!/*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className={'content-block dx-card'}>
                    <div className="card-outline">
                        {componentToRender}
                    </div>
               </div>


                <Popup width={500} height={300}
                    contentRender={renderContent}
                       visible={isPopupVisible}
                       hideOnOutsideClick={true}
                       onHiding={onPopRequest}
                       showCloseButton={true}
                       dragEnabled={true}
                       position="center"
                       title="승인요청"
                />

            </React.Fragment>
        )
    }




export default FileView;
import DataGrid, {
    Column,
    DataGridTypes,
    FilterRow, IPagingProps,
    Item,
    Pager,
    Paging,
    Selection,
    Toolbar
} from "devextreme-react/data-grid";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchContext from "../store/search-context";
import Loading from "../../../components/loading/Loading";

import {Button} from "devextreme-react/button";
import {POST} from "../../../contexts/fetch-action";
import {Popup} from "devextreme-react";
import TextArea from "devextreme-react/text-area";
import {jwtDecode} from "jwt-decode";
import AuthContext from "../../../components/auth-store/auth-context";

type Props = {
     visibleOption : boolean | undefined
    , pageCount : number | undefined
    , type: string | undefined
    , mode: "multiple" | "single" | "none" | undefined
    , fileCode: string | undefined
}

const SearchGrid:React.FC<Props> = (props) => {

    //0. Variables
    const searchCtx = useContext(SearchContext);
    const navigate = useNavigate();
    const [elasticResponse, setElasticResponse] = useState<any>();
    const [jsonData, setJsonData] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
    const [isPopupVisible, setPopupVisibility] = useState(false);
    const [isButtonVisible, setButtonVisible] = useState(false);
    const [reqDesc,setReqDesc] =useState("");
    const authCtx = useContext(AuthContext);

    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 20];

    const [focusedRowKey, setFocusedRowKey] = useState<any>('');
    const [autoNavigateToFocusedRow, setautoNavigateToFocusedRow] = useState<boolean>(true);

    const [pageIndex, setPageIndex] = useState<any>();

    interface RowData {
        key: any; // 선택한 행의 키
        fileCode: number;
        reqDesc: string; // 해당 키에 대응하는 reqDesc
    }



    //1. Onload
    useEffect(() => {

        //loading
        setLoading(true);
        
        //focus 설정
        if(searchCtx.elasticResponse !== undefined){
            setLoading(false);
            setElasticResponse(searchCtx.elasticResponse);
            setFocusedRowKey(props.fileCode);
            setautoNavigateToFocusedRow(true);
        }
        
        //초기화할 경우 설정 (추후정리 필요)
        if(!searchCtx.autoOption){
            setFocusedRowKey(null);
            setPageIndex(0);
        }else{
            setPageIndex(null);
        }

     }, [searchCtx.elasticResponse]);

    useEffect(() => {
        fetchData();
    },[elasticResponse]);

    // json data 변환 : elasticRes => totalhits, searchResults 포함
    const fetchData = async () => {
      if (elasticResponse && elasticResponse.searchResults) setJsonData(elasticResponse.searchResults)
      else setJsonData([])
    }

    //2. 상세화면 이동
    const onRowClick = (e: DataGridTypes.RowClickEvent) => {
        navigate('/search',{
            state: {
                fileCode: e.key ,
                type: props.type,
                pageState: 'V'
            }
        });
    }


    //4. 전체 선택
    const onSelectionChanged = useCallback(({ selectedRowKeys: changedRowKeys }: { selectedRowKeys: any[] }) => {
        setSelectedRowKeys(changedRowKeys);
        setButtonVisible(true);
      }, [],
    );

    //7. 팝업 오픈
    const onPopRequest =()=>{
        setPopupVisibility(!isPopupVisible);
        setReqDesc("제안서 작성 시에 필요합니다.");
    }

    //8. 승인요청
    const onApprovalRequest = () =>{
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        const rowDataList: RowData[] = selectedRowKeys.map((selectedRowKeys: any) => {
            return {
                fileCode: selectedRowKeys,
                reqDesc: reqDesc,
                inid:decodedToken?.sub,
                userSeq:authCtx.userObj.userSeq
            };
        });

        const response = POST("/api/reqdata/batch-request",{rowDataList: rowDataList},{headers: {'Authorization': 'Bearer ' + authCtx.token}});
        response.then(response => {
            window.location.reload()
        }).catch((error) =>{})
    }

    useEffect(() => {
         if(selectedRowKeys.length==0){
             setButtonVisible(false);
         }
     }, [selectedRowKeys]);



    const onPageIndexChange = () => {
        setautoNavigateToFocusedRow(false);
        setPageIndex(null);
    };



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

        return(
            <div className={props.type !== 'H' ? 'content-block dx-card responsive-paddings' : ''}>
                <div className="space-between card-description-margin">
                    <div className={props.type == 'H' ? 'display-option':''}>
                         <p>
                             {searchCtx.pageResponse?.reqSearchContent !== '' ?
                                 (<b>{searchCtx.pageResponse?.reqSearchContent}</b>) : (<b>전체</b>)} 에 대한 검색결과 :{" "}
                             {elasticResponse && elasticResponse?.totalHits !== undefined ?
                                 (<b>{elasticResponse?.totalHits}</b>) : (<b>0</b>)} 건
                         </p>
                     </div>
                    <div>
                        <Button
                             width={100}
                             text="일괄요청"
                             type="default"
                             stylingMode="outlined"
                             visible={isButtonVisible}
                             onClick={onPopRequest}
                        />
                    </div>
                </div>
                <div className="loading-div">
                    {loading ? <Loading /> : null}
                        <DataGrid dataSource={jsonData.map((item, index) => ({ ...item, index: index + 1 }))}
                                  showBorders={true} hoverStateEnabled={true}
                                  keyExpr="fileCode"
                                  onRowClick={onRowClick}
                                  onSelectionChanged={onSelectionChanged}
                                  allowColumnResizing={true}
                                  focusedRowEnabled={searchCtx.autoOption}
                                  focusedRowKey={focusedRowKey}
                                  autoNavigateToFocusedRow={autoNavigateToFocusedRow}
                        >
                            <Selection mode= {props.mode} allowSelectAll={false} />

                            <FilterRow visible={props.visibleOption} />
                            <Paging
                                defaultPageSize={props.pageCount}
                                enabled={props.visibleOption}
                                pageIndex={pageIndex}
                                onPageIndexChange={onPageIndexChange}
                            />

                            <Pager
                                    visible={true}
                                    allowedPageSizes={allowedPageSizes}
                                    showPageSizeSelector={props.visibleOption}
                                    showInfo={props.visibleOption}
                                    showNavigationButtons={props.visibleOption}
                            />

                            <Column dataField="index" caption="" width='10%' alignment={"center"}/>
                            {/*<Column dataField="score" caption="점수" width='15%' visible={props.visibleOption} alignment={"center"}/>*/}
                            <Column dataField="organiName" caption="발주기관" width='30%' alignment={"center"}/>
                            <Column dataField="projectName" caption="프로젝트" width='45%' visible={props.visibleOption} alignment={"center"}/>
                            <Column dataField="fileName" caption="파일명" width='45%' />
                            <Column dataField="typeFile" caption="자료구분"width='20%' alignment={"center"}/>
                            <Column dataField="projectYear" caption="사업연도" width='15%' visible={props.visibleOption} alignment={"center"}/>
                        </DataGrid>

                </div>
                <Popup width={500} height={300}
                     contentRender={renderContent}
                    visible={isPopupVisible}
                    hideOnOutsideClick={true}
                    onHiding={onPopRequest}
                    showCloseButton={true}
                    dragEnabled={true}
                    position="center"
                    title="일괄요청"
                />
             </div>
        )
    }


export default SearchGrid;
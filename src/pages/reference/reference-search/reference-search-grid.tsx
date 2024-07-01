import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import DataGrid, {Column, FilterRow, Pager, Paging, DataGridTypes, Toolbar, Item} from "devextreme-react/data-grid";
import AuthContext from "../../../components/auth-store/auth-context";
import {Button} from "devextreme-react/button";
import SelectBox from "devextreme-react/select-box";
import {jwtDecode} from "jwt-decode";


type Props = {
     visibleOption : boolean | undefined
    , pageCount : number | undefined
    , resultList: any[] | undefined
    , type : string | undefined
}


const ReferenceSearchGrid:React.FC<Props> = (props) => {

    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];


    //1. Onload
    useEffect(() => {
        if (props.resultList) {
              setData(props.resultList);
            }
        } , [props.resultList]);

    //2. onClickRow
    const onClickRow = (e: DataGridTypes.RowClickEvent) => {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        var body = {
           fileCode:e.key,
           viewCnt:e.data.viewCnt +1
        }

        if(e.data.inid!=decodedToken?.sub){
            viewCount(body);
        }
        navigate('/reference/view',{
               state: {
                   fileCode: body.fileCode,
                   type: props.type
               }
        })


    }

    const viewCount=(body:any)=>{
        POST("/api/reference/viewCount",body,{headers:{'Authorization': 'Bearer ' + authCtx.token}});
    }

    return(
        <div>
            <DataGrid dataSource={data.map((item, index) => ({ ...item, index: index + 1 }))}
                      showBorders={true} hoverStateEnabled={true}
                      keyExpr="fileCode"
                      onRowClick={onClickRow}
                      allowColumnResizing={true}>
                <FilterRow visible={props.visibleOption}  />
                <Paging defaultPageSize={props.pageCount} />
                <Pager
                        visible={true}
                        allowedPageSizes={allowedPageSizes}
                        showPageSizeSelector={props.visibleOption}
                        showInfo={props.visibleOption}
                        showNavigationButtons={props.visibleOption}
                />
                <Toolbar visible={props.visibleOption}>
                    <Item location="after">
                        <Button
                         width={120}
                         text="파일 업로드"
                         type="default"
                         stylingMode="outlined"
                        onClick={()=>navigate('/reference/upload')}/>
                    </Item>
                </Toolbar>

                <Column caption="번호"
                     cellRender={(data) => {
                       return <span>{data.row.dataIndex + 1}</span>;
                     }} width="8%"/>
                 <Column dataField="titleFile" caption="제목" width='30%'/>
                 <Column dataField="fileName" caption="파일명" width='30%' />
                 <Column dataField="userName" caption="작성자" width='10%'/>
                  <Column dataField="viewCnt" caption="조회수" format="#,###" width='8%'
                          cellRender={(data) => {
                             const viewCnt = data.data.viewCnt || 0;
                             return <span>{viewCnt}</span>;
                           }}/>
                  <Column dataField="downCnt" caption="다운로드수" format="#,###" width='8%'
                          cellRender={(data) => {
                             const viewCnt = data.data.downCnt || 0;
                             return <span>{viewCnt}</span>;
                           }}/>
                 <Column dataField="indt" caption="등록일자" width='15%'/>
           </DataGrid>
        </div>
    )

}

export default ReferenceSearchGrid;


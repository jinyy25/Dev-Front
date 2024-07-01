import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import DataGrid, {Column, DataGridTypes, FilterRow, Pager, Paging} from "devextreme-react/data-grid";
import AuthContext from "../../../components/auth-store/auth-context";

type Props = {
     visibleOption : boolean | undefined
    , pageCount : number | undefined
    , search : string | undefined
    , type : string | undefined
}

const NoticeListGrid:React.FC<Props> = (props) => {

    //0. Variables
    const navigate = useNavigate()
    const authCtx = useContext(AuthContext)
    const [resultList, setResultList] = useState<any[]>([])
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];

    //1. Onload
    useEffect(() => {searchSubmit()}, [])

    //2. Search
    const searchSubmit = () => {
        let rowCount: number | undefined = 0;
        if (props.type === "H") rowCount=props?.pageCount
        let body={
            title:props.search,
            rowCount:rowCount
        }
        const response = POST("/api/notice/search",body, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            setResultList(response?.data);
        }).catch((error) =>{})
    }

    //3. row click
    const onRowClick = (e: DataGridTypes.RowClickEvent) => navigate('/viewnotice',{ state: { boardId: +e.key } })

    return(
        <DataGrid dataSource={resultList.map((item, index) => ({ ...item, index: index + 1 }))}
                  showBorders={true} hoverStateEnabled={true} keyExpr="boardId"
                  showColumnLines={false}
                  onRowClick={onRowClick}
                  allowColumnResizing={true}>
                <FilterRow visible={props.visibleOption}  />
                <Paging defaultPageSize={props.pageCount}
                        enabled={props.visibleOption}/>
                  <Pager visible={true}
                         allowedPageSizes={allowedPageSizes}
                         showPageSizeSelector={props.visibleOption}
                         showInfo={props.visibleOption}
                         showNavigationButtons={props.visibleOption}
                  />
                <Column dataField="index" caption="" width='5%' visible={props.visibleOption} alignment={"center"}/>
                <Column dataField="title" caption="제목" width='75%'/>
                <Column dataField="writer" caption="작성자" width='15%' visible={props.visibleOption} alignment={"center"}/>
                <Column dataField="indt" caption="작성일자" width='15%' alignment={"center"}/>
          </DataGrid>
    )
}
export default NoticeListGrid;
import React, {useEffect, useState} from "react";
import DataGrid, {Column, DataGridTypes, FilterRow, Pager, Paging} from "devextreme-react/data-grid";
import {useNavigate} from "react-router-dom";


type Props = {
     visibleOption : boolean | undefined
    , pageCount : number | undefined
    , resultList: any[] | undefined
}

const FileGrid:React.FC<Props> = (props) => {

    const [data, setData] = useState<any[]>([])
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];

    useEffect(() => {
        if (props.resultList) setData(props.resultList)
        } , [props.resultList])


    const navigate = useNavigate();
    const onRowClick = (e: DataGridTypes.RowClickEvent) => {
        navigate('/search',{
            state: {
                fileCode: e.data.fileCode ,
                type: "H",
                pageState: 'V'
            }
        });
    }

    return(
        <DataGrid dataSource={data.map((item, index) => ({ ...item, index: index + 1 }))}
                  showBorders={true} hoverStateEnabled={true}
                  onRowClick={onRowClick}
        >
            <FilterRow visible={props.visibleOption} />
            <Paging defaultPageSize={props.pageCount} />

          <Pager
              visible={true}
              allowedPageSizes={allowedPageSizes}
              showPageSizeSelector={props.visibleOption}
              showInfo={props.visibleOption}
              showNavigationButtons={props.visibleOption} />

            <Column dataField="index" caption="번호" width='6%'/>
            <Column dataField="projectName" caption="프로젝트명" width='27%'/>
            <Column dataField="fileName" caption="파일명" width='27%'/>
            <Column dataField="reqTotal" caption="총건수" width='10%' />
            <Column dataField="reqConfirm" caption="승인건수" width='10%' />
            <Column dataField="reqReject" caption="반려건수" width='10%' />
            <Column dataField="reqRun" caption="요청중" width='10%' />

        </DataGrid>
    )
}

export default FileGrid;
import React from "react";
import DataGrid, {Column, DataGridTypes, FilterRow, Pager, Paging} from "devextreme-react/data-grid";


type Props = {
     visibleOption : boolean | undefined
    , pageCount : number | undefined
    , resultList: any[] | undefined
}

const PersonGrid:React.FC<Props> = (props) => {
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];

    return(
        <DataGrid dataSource={props.resultList} showBorders={true} hoverStateEnabled={true} keyExpr="userId">
              <Paging defaultPageSize={props.pageCount} />

            <Pager
                visible={true}
                allowedPageSizes={allowedPageSizes}
                showPageSizeSelector={props.visibleOption}
                showInfo={props.visibleOption}
                showNavigationButtons={props.visibleOption} />

            <Column dataField="userName" caption="사용자" width='8%'/>
            <Column dataField="totalCnt" caption="총건수" width='8%' />
            <Column dataField="cnt1" caption="1월" width='7%' />
            <Column dataField="cnt2" caption="2월" width='7%' />
            <Column dataField="cnt3" caption="3월" width='7%' />
            <Column dataField="cnt4" caption="4월" width='7%' />
            <Column dataField="cnt5" caption="5월" width='7%' />
            <Column dataField="cnt6" caption="6월" width='7%' />
            <Column dataField="cnt7" caption="7월" width='7%' />
            <Column dataField="cnt8" caption="8월" width='7%' />
            <Column dataField="cnt9" caption="9월" width='7%' />
            <Column dataField="cnt10" caption="10월" width='7%' />
            <Column dataField="cnt11" caption="11월" width='7%' />
            <Column dataField="cnt12" caption="12월" width='7%' />

        </DataGrid>
    )
}

export default PersonGrid;
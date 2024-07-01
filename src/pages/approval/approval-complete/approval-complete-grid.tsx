import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DataGrid, {Column, DataGridTypes, FilterRow, Pager, Paging} from "devextreme-react/data-grid";
import ApprovalContext from "../store/approval-context";

type Props = {
     visibleOption : boolean | undefined
    , pageCount : number | undefined
    , type: string | undefined
}

const ApprovalCompleteGrid:React.FC<Props> = (props) => {

    //0. Variables
    const approvalCtx = useContext(ApprovalContext);
    const [data, setData] = useState<any[]>([]);
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];

    //1. Onload
    useEffect(() => {
        if (approvalCtx.approvalResponse) {
              setData(approvalCtx.approvalResponse);
            }
        } , [approvalCtx.approvalResponse]);

    //2. 상세화면 이동
    const navigate = useNavigate();
    const onRowClick = (e: DataGridTypes.RowClickEvent) => {
        navigate('/search',{
            state: {
                fileCode: e.key ,
                type: 'H',
                pageState: 'V'
            }
        });
    }


  return (
      <div className={props.type !== 'H' ? 'content-block dx-card responsive-paddings' : ''}>
          <DataGrid dataSource={data.map((item, index) => ({ ...item, index: index + 1 }))}
                    showBorders={true} hoverStateEnabled={true}
                    keyExpr="fileCode"
                    onRowClick={onRowClick}
                    allowColumnResizing={true}>

              <FilterRow visible={props.visibleOption}  />
              <Paging defaultPageSize={props.pageCount} enabled={props.visibleOption}/>
                  <Pager visible={true}
                         allowedPageSizes={allowedPageSizes}
                         showPageSizeSelector={props.visibleOption}
                         showInfo={props.visibleOption}
                         showNavigationButtons={props.visibleOption} />

                <Column dataField="index" caption="" width='5%' visible={props.visibleOption} alignment={"center"}/>
                <Column dataField="fileName" caption="파일명" width='40%' />
                <Column dataField="reqCode" caption="상태"  width='15%' alignment={"center"}/>
                <Column dataField="userName" caption="요청자" width='10%' visible={props.visibleOption} alignment={"center"}/>
                <Column dataField="indt" caption="요청일시" width='17%' visible={props.visibleOption} alignment={"center"}/>
                <Column dataField="updt" caption="승인일시" width='17%' alignment={"center"}/>
              <Column dataField="reqDesc" caption="사유"   width='15%' visible={props.visibleOption}/>
          </DataGrid>
      </div>

  )
}

export default ApprovalCompleteGrid;
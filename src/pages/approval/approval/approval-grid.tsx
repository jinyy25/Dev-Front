import React, {useContext, useEffect, useState, useCallback} from "react";
import {POST} from "../../../contexts/fetch-action";
import {useNavigate} from "react-router-dom";
import DataGrid, {Column, FilterRow,  Selection, Pager, Paging, DataGridTypes, Toolbar, Item} from "devextreme-react/data-grid";
import SelectBox from 'devextreme-react/select-box'
import {Button} from "devextreme-react/button";
import ApprovalContext from "../store/approval-context";
import AuthContext from "../../../components/auth-store/auth-context";

type Props = {
     visibleOption : boolean | undefined
    , pageCount : number | undefined
}

const ApprovalGrid:React.FC<Props> = (props) => {

    //0. Variables
    const approvalCtx = useContext(ApprovalContext);
    const authCtx = useContext(AuthContext);
    const [data, setData] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];

    //1. onload
    useEffect(() => {
        if (approvalCtx.requestResponse) {
          setData(approvalCtx.requestResponse);
        }
    } , [approvalCtx.requestResponse]);

    //2. 전체승인
    const allApprovalHandler =()=>{
        const response = POST("/api/reqdata/approval",{reqSeqList: selectedRowKeys}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            window.location.reload()
        }).catch((error) =>{})
    }

    //3. 전체반려
    const allRejectHandler =()=>{
        const response = POST("/api/reqdata/reject",{reqSeqList: selectedRowKeys}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            window.location.reload()
        }).catch((error) =>{})
    }

    //4. 전체 선택
    const onSelectionChanged = useCallback(({ selectedRowKeys: changedRowKeys }: { selectedRowKeys: any[] }) => {
        setSelectedRowKeys(changedRowKeys);
      }, [],
    );

    //5. 상세화면 이동
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
        <div className={'content-block dx-card responsive-paddings'}>
            <DataGrid dataSource={data.map((item, index) => ({ ...item, index: index + 1 }))}
                      showBorders={true} hoverStateEnabled={true}
                      keyExpr="reqSeq"
                      onSelectionChanged={onSelectionChanged}
                      onRowClick={onRowClick}>
                <Selection mode="multiple"/>
                <FilterRow visible={props.visibleOption}  />
                <Paging defaultPageSize={props.pageCount} />
                    <Pager visible={true}
                           allowedPageSizes={allowedPageSizes}
                           showPageSizeSelector={props.visibleOption}
                           showInfo={props.visibleOption}
                           showNavigationButtons={props.visibleOption} />

                   <Column dataField="index" caption="" width='6%'/>
                   <Column dataField="fileName" caption="파일명" width='36%' />
                   <Column dataField="reqDesc" caption="사유" width='26%'/>
                   <Column dataField="indt" caption="요청일시" width='16%'/>
                   <Column dataField="userName" caption="요청자" format="currency" width='12%' />

                    <Toolbar>
                      <Item location="before">
                          <div className="dx-field buttons">
                              <div className="button-padding">
                                 <SelectBox
                                    placeholder="Select title"
                                    width={130}
                                    height={40}
                                />
                              </div>
                              <div className="button-padding">
                                  <Button
                                      type="default"
                                      stylingMode="outlined"
                                      width={80}
                                      text="초기화"
                                  />
                              </div>
                          </div>
                      </Item>
                        <Item location="after">
                                <div className="dx-field buttons">
                                    <div className="button-padding">
                                      <Button
                                        width={100}
                                        text="일괄승인"
                                        type="default"
                                        stylingMode="outlined"
                                        onClick={allApprovalHandler}
                                      />
                                  </div>
                                    <div className="button-padding">
                                      <Button
                                        width={100}
                                        text="일괄반려"
                                        type="default"
                                        stylingMode="outlined"
                                        onClick={allRejectHandler}
                                      />
                                  </div>
                                </div>
                        </Item >
                    </Toolbar>
             </DataGrid>
        </div>
    )

}

export default ApprovalGrid;


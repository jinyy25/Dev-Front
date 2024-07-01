import React, {useContext, useEffect, useState, useCallback} from "react";
import DataGrid, {Column, DataGridTypes, FilterRow, Pager, Paging, Toolbar,Item} from "devextreme-react/data-grid";
import {Button} from "devextreme-react/button";
import {useNavigate} from "react-router-dom";


type Props = {
    resultList : any
}

const AskGrid:React.FC<Props> = (props) => {

    //0. Variables
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 'all'];
    const navigate = useNavigate()


    return(

            <DataGrid
                    dataSource={props.resultList.map((item:any, index:number) => ({ ...item, index: index + 1 }))}
                          keyExpr="askId"
                            showBorders={true}
                          hoverStateEnabled={true}
                          allowColumnResizing={true}
                >
                    <Paging defaultPageSize={10} />
                  <Pager
                      visible={true}
                      showPageSizeSelector={true}
                      showInfo={true}
                      showNavigationButtons={true} />

                    <Column dataField="index" caption="번호" width='6%'/>
                    <Column dataField="category" caption="분류" width='10%' />
                    <Column dataField="askTitle" caption="제목" width='45%' />
                    <Column dataField="askWriter" caption="작성자" width='10%'/>
                    <Column dataField="askEmail" caption="email / phone" width='10%'/>
                    <Column dataField="indt" caption="등록일자" width='10%' />



                    <Toolbar>
                           <Item location="after">
                                   <div className="dx-field buttons">
                                       <Button
                                             width={100}
                                             text="등록화면"
                                             type="default"
                                             stylingMode="contained"
                                             className="margin-10"
                                             onClick={()=>navigate('/ask-upload')}/>
                                   </div>
                           </Item >
                       </Toolbar>
                </DataGrid>
    )

}

export default AskGrid;


import DataGrid, {Column, DataGridTypes, FilterRow, Pager, Paging} from "devextreme-react/data-grid";
import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchContext from "../store/search-context";
import Loading from "../../../components/loading/Loading";
import {
    TreeList
} from 'devextreme-react/tree-list';

type Props = {
     visibleOption : boolean | undefined
    , pageCount : number | undefined
    , type: string | undefined
}

const SearchGrid:React.FC<Props> = (props) => {

    //0. Variables
    const searchCtx = useContext(SearchContext);
    const navigate = useNavigate();
    const [elasticResponse, setElasticResponse] = useState<any>();
    const [jsonData, setJsonData] = useState<any[]>([]);
    const allowedPageSizes: (DataGridTypes.PagerPageSize | number)[] = [5, 10, 20];
    const [loading, setLoading] = useState(true);

    //1. Onload
    useEffect(() => {
        setLoading(true);
        if(searchCtx.elasticResponse !== undefined){
            setLoading(false);
            setElasticResponse(searchCtx.elasticResponse);
        }
     }, [searchCtx.elasticResponse]);

    useEffect(() => {
        fetchData();
    },[elasticResponse]);

    // json data 변환 : elasticRes => totalhits, searchResults 포함
    const fetchData = async () => {
      if (elasticResponse && elasticResponse.searchResults) {
          setJsonData(elasticResponse.searchResults)
             console.log("elasticResponse.searchResults:",elasticResponse.searchResults);
        }else{
            setJsonData([])
        }


    }

    //2. 상세화면 이동
    const onRowClick = (e: DataGridTypes.RowClickEvent) => {
        navigate('/search',{
            state: { fileCode: +e.key , type: props.type}
        });
    }





        return(<>
            <div className={props.type !== 'H' ? 'content-block dx-card responsive-paddings' : ''}>
                <div  className={props.type == 'H' ? 'display-option':''}>
                    <p className="card-description-margin">
                        {searchCtx.pageResponse?.reqSearchContent !== '' ?
                            (<b>{searchCtx.pageResponse?.reqSearchContent}</b>) : (<b>전체</b>)} 에 대한 검색결과 :{" "}
                        {elasticResponse && elasticResponse?.totalHits !== undefined ?
                            (<b>{elasticResponse?.totalHits}</b>) : (<b>0</b>)} 건
                      </p>
                </div>
                <div className="loading-div">

                    <TreeList dataSource={jsonData.map((item, index) => ({ ...item, index: index + 1 }))}
                              keyExpr="index"
                              parentIdExpr="upperCode"
                              rootValue="upperIndex"
                                id="treeList"
                                // keyExpr="ID"
                                // parentIdExpr="HeadID"
                                // autoExpandAll={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                columnAutoWidth={true}
                                showBorders={true} hoverStateEnabled={true}
                                             // onRowClick={onRowClick}
                                             // allowColumnResizing={true}
                    >

                                <FilterRow visible={props.visibleOption} />
                                <Paging defaultPageSize={props.pageCount} enabled={props.visibleOption}/>

                                <Pager visible={true}
                                       allowedPageSizes={allowedPageSizes}
                                       showPageSizeSelector={props.visibleOption}
                                       showInfo={props.visibleOption}
                                       showNavigationButtons={props.visibleOption} />
                                <Column dataField="index" caption="" width='10%' alignment={"center"}/>
                                <Column dataField="organiName" caption="발주기관" width='30%' alignment={"center"}/>
                                <Column dataField="projectName" caption="프로젝트" width='45%' visible={props.visibleOption} alignment={"center"}/>
                                <Column dataField="fileName" caption="파일명" width='45%' />
                                <Column dataField="typeFile" caption="자료구분"width='20%' alignment={"center"}/>
                                <Column dataField="projectYear" caption="사업연도" width='15%' visible={props.visibleOption} alignment={"center"}/>
                    </TreeList>


                    {/*{loading ? <Loading /> : null}*/}
                    {/*    <DataGrid dataSource={jsonData.map((item, index) => ({ ...item, index: index + 1 }))}*/}
                    {/*              showBorders={true} hoverStateEnabled={true}*/}
                    {/*              keyExpr="fileCode"*/}
                    {/*              onRowClick={onRowClick}*/}
                    {/*              allowColumnResizing={true}>*/}
                    {/*        <FilterRow visible={props.visibleOption} />*/}
                    {/*        <Paging defaultPageSize={props.pageCount} enabled={props.visibleOption}/>*/}

                    {/*        <Pager visible={true}*/}
                    {/*               allowedPageSizes={allowedPageSizes}*/}
                    {/*               showPageSizeSelector={props.visibleOption}*/}
                    {/*               showInfo={props.visibleOption}*/}
                    {/*               showNavigationButtons={props.visibleOption} />*/}
                    {/*        <Column dataField="index" caption="" width='10%' alignment={"center"}/>*/}
                    {/*        <Column dataField="organiName" caption="발주기관" width='30%' alignment={"center"}/>*/}
                    {/*        <Column dataField="projectName" caption="프로젝트" width='45%' visible={props.visibleOption} alignment={"center"}/>*/}
                    {/*        <Column dataField="fileName" caption="파일명" width='45%' />*/}
                    {/*        <Column dataField="typeFile" caption="자료구분"width='20%' alignment={"center"}/>*/}
                    {/*        <Column dataField="projectYear" caption="사업연도" width='15%' visible={props.visibleOption} alignment={"center"}/>*/}
                    {/*    </DataGrid>*/}

                </div>

             </div>
            </>
        )
    }


export default SearchGrid;





















// import React, { useState } from 'react';
// import 'devextreme/dist/css/dx.common.css';
// import 'devextreme/dist/css/dx.light.css';
// // import './App.css'
//
// import {
//   TreeList,
//   ColumnChooser,
//   ColumnFixing,
//   Column,
//   RequiredRule,
//   FilterRow,
//   SearchPanel,
//   Selection,
//   Editing,
//   RowDragging,
//   Paging
// } from 'devextreme-react/tree-list';
// import { employees } from './employees';

// function SelectedEmployee(props) {
//   if(props.employee) {
//     return (
//       <p id="selected-employee">
//         Selected employee: {props.employee.FullName}
//       </p>
//     );
//   }
//   return null;
// }

// function SearchGrid() {
//   const [selectedEmployee, setSelectedEmployee] = useState();
//   const [currentEmployees, setCurrentEmployees] = useState(employees);
//   const selectEmployee = (e:any) => {
//     // e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
//     //   setSelectedEmployee(employee);
//     // });
//   }
//
//   const onDragChange = (e:any) => {
//     let visibleRows = e.component.getVisibleRows(),
//       sourceNode = e.component.getNodeByKey(e.itemData.ID),
//       targetNode = visibleRows[e.toIndex].node;
//
//     while (targetNode && targetNode.data) {
//       if (targetNode.data.ID === sourceNode.data.ID) {
//         e.cancel = true;
//         break;
//       }
//       targetNode = targetNode.parent;
//     }
//   }
//
//   const onReorder = (e:any) => {
//     let visibleRows = e.component.getVisibleRows(),
//       sourceData = e.itemData,
//       targetData = visibleRows[e.toIndex].data,
//       employeesReordered = currentEmployees,
//       sourceIndex = employeesReordered.indexOf(sourceData),
//       targetIndex = employeesReordered.indexOf(targetData);
//
//     if (e.dropInsideItem) {
//       sourceData = { ...sourceData, HeadID: targetData.ID };
//       employeesReordered = [...employeesReordered.slice(0, sourceIndex), sourceData, ...employeesReordered.slice(sourceIndex + 1)];
//     } else {
//       if (sourceData.HeadID !== targetData.HeadID) {
//         sourceData = { ...sourceData, HeadID: targetData.HeadID };
//         if (e.toIndex > e.fromIndex) {
//           targetIndex++;
//         }
//       }
//       employeesReordered = [...employeesReordered.slice(0, sourceIndex), ...employeesReordered.slice(sourceIndex + 1)];
//       employeesReordered = [...employeesReordered.slice(0, targetIndex), sourceData, ...employeesReordered.slice(targetIndex)];
//     }
//
//     setCurrentEmployees(employeesReordered);
//   }
//
//   return (
//     <div className="App">
//       <TreeList
//         id="treeList"
//         dataSource={currentEmployees}
//         rootValue={1}
//         keyExpr="ID"
//         parentIdExpr="HeadID"
//         autoExpandAll={true}
//         allowColumnReordering={true}
//         allowColumnResizing={true}
//         columnAutoWidth={true}
//         onSelectionChanged={selectEmployee}>
//         <Column dataField="FullName">
//           <RequiredRule />
//         </Column>
//         <Column
//           dataField="Position">
//           <RequiredRule />
//         </Column>
//         <Column
//           dataField="BirthDate"
//           dataType="date"
//           width={100}>
//           <RequiredRule />
//         </Column>
//         <Column
//           dataField="HireDate"
//           dataType="date"
//           width={100}>
//           <RequiredRule />
//         </Column>
//         <Column dataField="City" />
//         <Column
//           dataField="State">
//           <RequiredRule />
//         </Column>
//         <Column dataField="Email" visible={false} />
//         <Column dataField="MobilePhone" />
//         <Column dataField="Skype" />
//
//         <ColumnFixing enabled={true} />
//         <ColumnChooser enabled={true} />
//         <FilterRow visible={true} />
//         <SearchPanel visible={true} />
//
//         <Selection mode="single" />
//
//
//         <Paging
//           enabled={true}
//           defaultPageSize={10}
//         />
//
//       </TreeList>
//       {/*<SelectedEmployee employee={selectedEmployee} />*/}
//     </div>
//   );
// }
//
// export default SearchGrid;
import React, {useState, useEffect, useContext} from 'react';
import {GET} from "../../../contexts/fetch-action";
import DataGrid, {Column} from "devextreme-react/data-grid";
import AuthContext from "../../../components/auth-store/auth-context";
import '../scss/statistics.scss';


export default function Docs(){

    //0. Variables
    const [statDocs,setStatDocs] = useState<any[]>([]);
    const authCtx = useContext(AuthContext);

    //1. Onload
    useEffect(() => {
        searchSubmit();
    }, []);


    //2. Search
    const searchSubmit = () => {
        const response = GET("/api/stat/statdocs", {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            setStatDocs(response?.data);
         }).catch((error) =>{})
    }

    return(
        <React.Fragment>
            <div className={'content-block dx-card'}>
                <div className="title-padding">
                  <h4 className="card-title">파일등록현황</h4>
                </div>
            </div>
            <div className={'content-block dx-card responsive-paddings'}>
                    <div>
                        <DataGrid dataSource={statDocs} showBorders={true} hoverStateEnabled={true} >
                             <Column dataField="ext" caption="문서종류" width='20%'/>
                             <Column dataField="totalCnt" caption="KMS 등록" width='10%'/>
                             <Column dataField="fileCnt" caption="등록(신규)" width='9%' />
                             <Column dataField="noExtCnt" caption="미지원" width='9%' />
                             <Column dataField="fileErrCnt" caption="파일오류" width='9%' />
                             <Column dataField="extractCnt" caption="내용추출" width='9%' />
                             <Column dataField="extrErrCnt" caption="추출실패" width='9%' />
                             <Column dataField="elasticCnt" caption="조회등록" width='9%' />
                             <Column dataField="passageCnt" caption="문단분리" width='9%' />
                             <Column dataField="keywordCnt" caption="키워드" width='9%' />
                       </DataGrid>
                    </div>
                 </div>
        </React.Fragment>
    )
}

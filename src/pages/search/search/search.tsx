import React, {useContext,useEffect,useCallback, useState} from 'react';
import TextBox from 'devextreme-react/text-box';
import { SelectBox } from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { Button } from 'devextreme-react/button';
import Box, { Item } from 'devextreme-react/box';
import { Lookup } from 'devextreme-react/lookup';
import AuthContext from '../../../components/auth-store/auth-context';
import SearchContext from '../store/search-context'
import 'devextreme/data/odata/store';
import '../scss/search.scss';


type Props = {
    type: string | undefined
    ,page: string | undefined
}


const Search:React.FC<Props> = (props) => {

    //0. Variables
    const authCtx = useContext(AuthContext);
    const searchCtx = useContext(SearchContext);
    let isLogin = authCtx.isLoggedIn;

    //Elasticsearch
    const [reqSearchContent,setSearchContent] =useState<any>("");
    const [reqProjectNm,setProjectNm] =useState<any>("");
    const [reqOrg, setOrgNm] = useState<any>('');
    const [reqStypeCd, setStypeCd] = useState<any>('');
    const [reqStartYear, setStartYear] = useState<any>('');
    const [reqEndYear, setEndYear] = useState<any>('');

    const [isAddItemVisible, setIsAddItemVisible] = useState(false);
    const [dateOption, setDateOption] = useState<any>('');

    //Checkbox
    const [reqPpt, setPpt] = useState(true);
    const [reqDoc, setDoc] = useState(true);
    const [reqXls, setXls] = useState(true);
    const [reqHwp, setHwp] = useState(true);
    const [reqPdf, setPdf] = useState(true);


    //1. Onload
    useEffect(() => {
        if(props.page =="B" && searchCtx.pageResponse) {
            setSearchContent(searchCtx.pageResponse?.reqSearchContent);
            setProjectNm(searchCtx.pageResponse?.reqProjectNm);
            setOrgNm(searchCtx.pageResponse?.reqOrg);
            setStypeCd(searchCtx.pageResponse?.reqStypeCd);
            setStartYear(searchCtx.pageResponse?.reqStartYear);
            setEndYear(searchCtx.pageResponse?.reqEndYear);
            onClickHide()
        }else if(props.page =="B"){
            searchCtx.getOrgnmOptions(authCtx.token);
            searchCtx.getDateOptions(authCtx.token);
            searchCtx.getStypeOptions(authCtx.token);
            setDateOption(true);
        }else{
            searchCtx.getOrgnmOptions(authCtx.token);
            searchCtx.getDateOptions(authCtx.token);
            searchCtx.getStypeOptions(authCtx.token);
        }
    }, []);

    useEffect(() => {
        if(props.page !="B"||dateOption) {
            let firstDate=searchCtx.dateList[0];
            let lastDate=searchCtx.dateList[searchCtx.dateList.length-1];
            setStartYear(firstDate);
            setEndYear(lastDate);
            onSubmit(firstDate, lastDate);
        }

    },[searchCtx.dateList])

    useEffect(() => {
        let body={
            syear: reqStartYear
            ,eyear: reqEndYear
        }
        searchCtx.getProjectOptions(body,authCtx.token);
    }, [reqStartYear,reqEndYear]);


    //2. Search
    const onSubmit =(firstDate:any, lastDate:any) => {
        let fileExtForm =getFileExtForm();
        let lastRow=0;
        let body: any | undefined;

        if(props.type=='H') lastRow=13
        body = {
            reqSearchContent: reqSearchContent
            ,reqOrg: reqOrg
            ,reqStypeCd: reqStypeCd
            ,reqStartYear: firstDate
            ,reqEndYear: lastDate
            ,reqProjectNm: reqProjectNm
            ,fileExtForm: fileExtForm
            ,firstRow: 1
            ,lastRow: lastRow
        }

        searchCtx.setAutoOption(false);
       searchCtx.getElasticsearchList(body, authCtx.token);
    };

    //체크박스
    const getFileExtForm=()=>{
        let fileExt = '';
        if (reqPpt) fileExt += '(ppt) OR (pptx)';
        if (reqDoc) {
          if (fileExt !== '') fileExt += ' OR ';
            fileExt += '(doc) OR (docx)';
        }
        if (reqXls) {
          if (fileExt !== '') fileExt += ' OR ';
            fileExt += '(xls) OR (xlsx)';
        }
        if (reqHwp) {
          if (fileExt !== '') fileExt += ' OR ';
            fileExt += '(hwp)';
        }
        if (reqPdf) {
          if (fileExt !== '') fileExt += ' OR ';
            fileExt += '(pdf)';
        }
        return fileExt;
    }

    //3. 상세버튼
    const onClickHide = () => setIsAddItemVisible((prevState) => !prevState)


    return(
        <React.Fragment>
            {props.type != 'H' && (
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline">
                    <Box direction="row" width="50%"  >
                        <Item ratio={1} >
                            <h4 className="card-title">회사자료</h4>
                        </Item>
                        <Item ratio={5} >
                            <div className="text-option">
                                  <p className="card-description">조건을 선택하여 문서를 찾아보세요.</p>
                              </div>
                        </Item>
                    </Box>
                </div>

                {/*문서내용검색*/}
                <div className="dx-fieldset">
                    <Box>
                        <Item ratio={2}>
                            <div className="dx-field">
                                <div className="dx-field-label">문서내용</div>
                                <div className="text-option">
                                    <TextBox
                                        showClearButton={true}
                                        width="100%"
                                        value={reqSearchContent}
                                        onValueChanged={(e) => setSearchContent(e.value)}
                                    />
                                </div>
                            </div>
                        </Item>
                        <Item ratio={1}>
                            <div className="dx-field buttons">
                                    <div className="button-padding">
                                        <Button
                                          width={100}
                                          text="상세"
                                          type="default"
                                          stylingMode="outlined"
                                          onClick={onClickHide}
                                        />
                                    </div>
                                      <div className="button-padding">
                                        <Button
                                          width={100}
                                          text="검색"
                                          type="default"
                                          stylingMode="contained"
                                          onClick={() => onSubmit(reqStartYear,reqEndYear)}
                                        />
                                    </div>
                              </div>
                        </Item>
                    </Box>
                </div>

                {/*상세보기*/}
                <div style={{ display: isAddItemVisible ? 'block' : 'none' }}>
                    {/*체크박스*/}
                    <div className="dx-fieldset">
                        <Box direction="row" width="100%">
                            <Item ratio={0.5}>
                                <div className="dx-field">
                                    <div className="dx-field-label">확장자</div>
                                </div>
                            </Item>
                            <Item ratio={5}>
                                <Box direction="row" width="100%">
                                    <Item ratio={0.6}>
                                        <div className="dx-field">
                                            <div className="dx-field-label caption-option">ppt</div>
                                            <div>
                                                <CheckBox
                                                    defaultValue={true}
                                                    onValueChanged={(e) => setPpt(e.value)}
                                                />
                                            </div>
                                        </div>
                                    </Item>
                                    <Item ratio={0.6}>
                                        <div className="dx-field">
                                              <div className="dx-field-label caption-option">doc</div>
                                              <div>
                                                <CheckBox
                                                    defaultValue={true}
                                                    onValueChanged={(e) => setDoc(e.value)}
                                                />
                                              </div>
                                        </div>
                                    </Item>
                                    <Item ratio={0.6}>
                                        <div className="dx-field">
                                            <div className="dx-field-label caption-option">pdf</div>
                                            <div>
                                                <CheckBox
                                                    defaultValue={true}
                                                    onValueChanged={(e) => setPdf(e.value)}
                                                />
                                            </div>
                                      </div>
                                    </Item>
                                    <Item ratio={0.6}>
                                        <div className="dx-field">
                                               <div className="dx-field-label caption-option">hwp</div>
                                               <div>
                                                   <CheckBox
                                                       defaultValue={true}
                                                       onValueChanged={(e) => setHwp(e.value)}
                                                   />
                                               </div>
                                         </div>
                                    </Item>
                                    <Item ratio={0.6}>
                                        <div className="dx-field">
                                               <div className="dx-field-label caption-option">xls</div>
                                               <div>
                                                   <CheckBox
                                                       defaultValue={true}
                                                       onValueChanged={(e) => setXls(e.value)}
                                                   />
                                               </div>
                                         </div>
                                    </Item>
                                    <Item ratio={2.5}></Item>
                                </Box>
                            </Item>
                        </Box>
                    </div>


                    {/*발주기관*/}
                    {/*자료구분*/}
                    <div className="dx-fieldset">
                        <Box  width="100%">
                            <Item ratio={1}>
                                <div className="dx-field">
                                    <div className="dx-field-label">발주기관</div>
                                    <Lookup
                                        width="70%"
                                        searchEnabled={true}
                                        dataSource={searchCtx.orgnmList}
                                        showClearButton={true}
                                        placeholder={"발주기관"}
                                        value={reqOrg}
                                        onValueChanged={(e) => setOrgNm(e.value)}
                                    >
                                            {/*<DropDownOptions showTitle={false} />*/}
                                    </Lookup>
                                </div>
                            </Item>
                            <Item ratio={1}>
                                <div className="dx-field">
                                    <div className="dx-field-label">자료구분</div>
                                        <Lookup
                                          width="70%"
                                          dataSource={searchCtx.stypeList}
                                          valueExpr="stypeCd"
                                          displayExpr="stypeNm"
                                          showClearButton={true}
                                          placeholder={"자료구분"}
                                          value={reqStypeCd}
                                          onValueChanged={(e) => setStypeCd(e.value)}
                                        >
                                        {/*<DropDownOptions showTitle={false} />*/}
                                   </Lookup>
                                </div>
                            </Item>
                        </Box>
                    </div>

                    {/*조회기간*/}
                    {/*프로젝트명*/}
                    <div className="dx-fieldset">
                        <Box>
                            <Item ratio={1}>
                                <div className="dx-field">
                                      <div className="dx-field-label">조회기간</div>
                                      <div className="dx-field-value field-width-70 date-flex">
                                          <SelectBox
                                              className="date-outline"
                                              stylingMode="outlined"
                                              items={searchCtx.dateList}
                                              selectedItem={searchCtx.dateList[0]}
                                              defaultValue={searchCtx.dateList[0]}
                                              value={reqStartYear}
                                              onValueChanged={(e)=>setStartYear(e.value)}
                                          />

                                          <SelectBox
                                              className="date-outline"
                                              stylingMode="outlined"
                                              items={searchCtx.dateList}
                                              selectedItem={searchCtx.dateList[searchCtx.dateList.length-1]}
                                              defaultValue={searchCtx.dateList[searchCtx.dateList.length-1]}
                                              value={reqEndYear}
                                              onValueChanged={(e)=>setEndYear(e.value)}
                                          />
                                      </div>
                                </div>
                            </Item>
                            <Item ratio={1}>
                                <div className="dx-field">
                                    <div className="dx-field-label">프로젝트명</div>
                                   <Lookup
                                       width="70%"
                                       searchEnabled={true}
                                       showClearButton={true}
                                       placeholder={"프로젝트명"}
                                       value={reqProjectNm}
                                       items={searchCtx.projectNmList}
                                       onValueChanged={(e)=>setProjectNm(e.value)}
                                    />
                                </div>
                            </Item>
                        </Box>
                    </div>

                </div>
            </div>)}
        </React.Fragment>
    );
}

export default Search;

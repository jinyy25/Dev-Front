import React, { useState } from "react";
import * as searchAction from './search-action';


type Props = { children?: React.ReactNode }

type OrgnmInfo = { orgnm: string };

type StypeInfo = {
    stypeNm: string
    stypeCd: number
};

type DateInfo = { date: string };

interface ElasticRequest {
    reqSearchContent: string
    ,reqOrg: string
    ,reqStypeCd: string
    ,reqStartYear: string
    ,reqEndYear: string
    ,reqProjectNm: string
    ,fileExtForm: string
    ,firstRow: number
    ,lastRow: number
}

interface ElasticResponse {
    totalHits: number
    ,searchResults: Array<string>
}


interface FileDetail {
    fileCode: number
    ,fileName: string
    ,projectYear: string
    ,projectName: string
    ,saveName: string
    ,fileExt: string
    ,tmpName: string
    ,typeFile: string
    ,organiName: string
    ,indt: string
    ,inid: string
    ,userId: string
    ,reqCode: number
}

interface RequestData {
    fileCode: number
    ,userId?: string
}

interface RequestYearData {
    syear: any
    ,eyear: any
}

interface Ctx {
    orgnmList: OrgnmInfo[];
    stypeList: StypeInfo[];
    dateList: DateInfo[];
    projectNmList: string[];
    elasticResponse?: ElasticResponse|undefined;
    getOrgnmOptions: (token:string) => void;
    getStypeOptions: (token:string) => void;
    getDateOptions: (token:string) => void;
    getProjectOptions: (requestYearData:RequestYearData, token:string) => void;
    getElasticsearchList: (elasticRequest:ElasticRequest,token:string)=> void;
    getFileInfo :(requestData:RequestData,token:string) => void;
    getPdfSlice :(token:string,tmpName:string) => void;
    fileDetail?: FileDetail|undefined ;
    pdfSlice: Array<string>;
    pdfFirstSlice? : undefined;
    exportedIndexes: string[];

    pageResponse: ElasticRequest|undefined;

    setExportedIndexes: (checkedIndexes:string[]) => void;
    pageIndex: number;

    setPage:(index:number) => void;

    resetHandler: () => void;
    setAutoOption:(re:boolean)=>void;
    autoOption: undefined
}

const SearchContext = React.createContext<Ctx>({
    orgnmList:[],
    stypeList:[],
    dateList:[],
    projectNmList:[],
    elasticResponse: undefined,
    getOrgnmOptions: (token:string) => {},
    getStypeOptions: (token:string) => {},
    getDateOptions: (token:string) => {},
    getElasticsearchList(elasticRequest: ElasticRequest, token: string) {},
    getFileInfo:(requestData:RequestData,token:string) => {},
    getPdfSlice:(token:string,tmpName:string) => {},
    getProjectOptions:(requestYearData:RequestYearData, token:string) => {},
    setExportedIndexes:(checkedIndexes:string[]) => {},
    fileDetail: undefined,
    pdfSlice: [],
    exportedIndexes:[],
    pageResponse: undefined,

    pageIndex:0,
    setPage:(index:number) => {},
    resetHandler:() => {},
    setAutoOption: (re:boolean) => {},
    autoOption:undefined
});


export const SearchContextProvider:React.FC<Props> = (props) => {


    const [orgnmList, setOrgnmList] = useState<OrgnmInfo[]>([]);
    const [stypeList, setStypeList] = useState<StypeInfo[]>([]);
    const [dateList, setDateList] = useState<DateInfo[]>([]);
    const [projectNmList, setProjectNmList] = useState<string[]>([]);
    const [elasticResponse, setElasticResponse] = useState<ElasticResponse>();

    const [fileDetail, setFileDetail] = useState<FileDetail>();
    const [pdfSlice, setPdfSlice] = useState<Array<string>>([]);
    const [pdfFirstSlice, setPdfFirstSlice] = useState();

    const [pageResponse, setPageResponse] = useState<ElasticRequest>();

    const [pageIndex, setPageIndex] =  useState<number>(0);
    const [exportedIndexes, setExportedIndexes] = useState<string[]>([]);

    const [autoOption, setAutoOption] = useState<any>();

    const reAutoOption = (option:boolean) => {
        setAutoOption(option);
    }

    //발주기관 option 가져오기
    const getOrgnmOptionsHandler =  (token?:string) => {
        if (token != null) {
            const data = searchAction.getOrgnmOptions(token);
            data.then((result) => {
              if (result !== null) {
                  const orgnm:OrgnmInfo[] = result.data;
                  setOrgnmList(orgnm);
              }
            })
        }
    }

    //조회기간 option
    const getDateOptionsHandler =  (token?:string) => {
        if (token != null) {
            const data = searchAction.getDateOptions(token);
            data.then((result) => {
              if (result !== null) {
                  const date:DateInfo[] = result.data;
                  setDateList(date);

                  var body={
                      syear:date[0],
                      eyear:date[date.length-1],
                  }

                  getProjectOptionsHandler(body,token);
              }
            })
        }
    }

    const getProjectOptionsHandler =(requestYearData:RequestYearData, token:string)=>{
        const data = searchAction.getProjectOptions(token,requestYearData);
        data.then((result) => {
           if (result !== null) {
               setProjectNmList(result.data);
           }
       })
    }


    //자료구분 option
    const getStypeOptionsHandler = (token?:string) => {
        if (token != null) {
            const data = searchAction.getStypeOptions(token);
            data.then( (result) => {
                if (result !== null) {
                    const stype: StypeInfo[] = result.data;
                     convertStype(stype);
                }
            })
        }
    }

    const convertStype =(stype:any)=>{
        const processedData: StypeInfo[]  = stype.map((item:any) => extractData(item));
        setStypeList(processedData);
    }

    const extractData = (str:any) => {
          const [variable, number] = str.split(',');
          return {
              stypeNm: variable.trim(),
              stypeCd: parseInt(number, 10),
          };
    };


    //검색버튼시
    const getElasticsearchHandler =(elasticRequest:ElasticRequest, token:string)=>{

        const data = searchAction.getElasticsearch(token,elasticRequest);
        data.then((result) => {
            if (result !== null) {
                const elasticResponse: ElasticResponse = result.data;
                setElasticResponse(elasticResponse);
                setPageResponse(elasticRequest);
            }
        })
    }

    //filedetail
    const getFileInfoHandler = (requestData:RequestData, token:string) =>{
        const data = searchAction.getFileInfo(token,requestData);
        data.then((result) => {
            if (result !== null) {
                const fileDetail: FileDetail = result.data;
                setFileDetail(fileDetail);
            }
        })
    }

    const getPdfSliceHandler = (tmpName:string, token:string) =>{
        const data = searchAction.getPdfSlice(token,tmpName);
        data.then((result) => {
            if (result !== null) {
                const pdfSlice = result.data;
                const firstData = result.data[0];
                setPdfSlice(pdfSlice);
                setPdfFirstSlice(firstData);
            }
        })
    }

    const setExportedIndexesHandler =(checkedIndexes:string[])=>{
        setExportedIndexes(checkedIndexes);
    }

    const setPageHandler =(index:number)=>{
        setPageIndex(index);
    }

    const resetHandler =()=>{
        setFileDetail(undefined);
    }


    const contextValue:Ctx = {
        pageIndex,
        setPage: setPageHandler,
        setExportedIndexes: setExportedIndexesHandler,
        exportedIndexes,
        pdfSlice,
        pdfFirstSlice,
        fileDetail,
        orgnmList,
        stypeList,
        dateList,
        projectNmList,
        elasticResponse,
        getOrgnmOptions: getOrgnmOptionsHandler,
        getStypeOptions: getStypeOptionsHandler,
        getDateOptions: getDateOptionsHandler,
        getProjectOptions: getProjectOptionsHandler,
        getElasticsearchList: getElasticsearchHandler,
        getFileInfo: getFileInfoHandler,
        getPdfSlice: getPdfSliceHandler,
        pageResponse,
        resetHandler:resetHandler,
        setAutoOption:reAutoOption,
        autoOption
    }

    return (
        <SearchContext.Provider value={contextValue}>
            {props.children}
        </SearchContext.Provider>
    );
  }

export default SearchContext;
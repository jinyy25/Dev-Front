import { GET, POST, PUT, DELETE }  from "../../../contexts/fetch-action";


interface ElasticRequest {
    reqSearchContent: string
    ,reqOrg: string
    ,reqStypeCd: string
    ,reqStartYear: string
    ,reqEndYear: string
    ,reqProjectNm: string
    ,fileExtForm: string
}

interface RequestData {
    fileCode: number
    ,userId?: string
}

interface RequestYearData{
    syear : any
    ,eyear : any
}


const createTokenHeader = (token:string) => {
  return {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
}

export const getOrgnmOptions = (token:string) => {
  const URL = '/api/search/orgnm';
  const response = GET(URL,createTokenHeader(token));
  return response
};



export const getStypeOptions = (token:string) => {
  const URL = '/api/search/stype';
  const response = GET(URL,createTokenHeader(token));
  return response
};

export const getDateOptions = (token:string) => {
  const URL = '/api/search/year';
  const response = GET(URL,createTokenHeader(token));
  return response
}


export const getElasticsearch = (token:string, elasticRequest:ElasticRequest) => {
    const URL = '/api/search/elasticsearch';
    const response = POST(URL,elasticRequest,createTokenHeader(token));
    return response;
}

export const getFileInfo = (token:string, requestData:RequestData) => {
    const URL = '/api/view/filedetail';
    const response = POST(URL,requestData,createTokenHeader(token));
    return response;
}

export const getPdfSlice = (token:string, tmpName:string) => {
    const URL = '/api/view/pdfslice';
    const response = POST(URL,{tmpName},createTokenHeader(token));
    return response;
}

export const getProjectOptions = (token:string, requestYearData:RequestYearData) => {
    const URL = '/api/search/projectnm';
    const response = POST(URL,requestYearData,createTokenHeader(token));
    return response;
}



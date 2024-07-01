import {  POST }  from "../../../contexts/fetch-action";

interface ApprovalRequest {
    startDate: any
    ,endDate: any
    ,userName: string
    ,reqTypeCd: number
    ,reqCode: any
    ,userId: string  | undefined
}

const createTokenHeader = (token:string) => {
  return {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
}

//승인처리현황
export const getApprovalList = (token:string,approvalRequest:ApprovalRequest) => {
  const URL = '/api/reqdata/approval-list';
  const response = POST(URL,approvalRequest,createTokenHeader(token));
  return response;
}


//승인요청현황, 반출승인
export const getRequestList = (token:string,approvalRequest:ApprovalRequest) => {
  const URL = '/api/reqdata/request-list';
  const response = POST(URL,approvalRequest,createTokenHeader(token));
  return response;
}
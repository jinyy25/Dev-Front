import React, {useState} from "react";
import * as approvalAction from "./approval-action";

type Props = { children?: React.ReactNode }

interface ApprovalRequest {
    startDate: any
    ,endDate: any
    ,userName: string
    ,reqTypeCd: any
    ,reqCode: any
    ,userId: any
    ,rowCount: number
}

interface ApprovalResponse {
    reqSeq: number
    ,reqCode: number
    ,fileCode: number
    ,reqDesc: string
    ,indt: string
    ,updt: string
    ,fileExt: string
    ,fileName: string
    ,saveName: string
    ,userName: string
}

interface Ctx {
    getApprovalList: (approvalRequest:ApprovalRequest,token:string)=> void;
    getRequestList: (approvalRequest:ApprovalRequest,token:string)=> void;
    approvalResponse:ApprovalResponse[];
    requestResponse:ApprovalResponse[];
    setApprovalBody : (approvalRequest:ApprovalRequest) => void;
    approvalRequest: ApprovalRequest|undefined
}

const ApprovalContext = React.createContext<Ctx>({

    getApprovalList(approvalRequest: ApprovalRequest, token: string) {},
    getRequestList(approvalRequest: ApprovalRequest, token: string) {},
    approvalResponse:[],
    requestResponse:[],
    setApprovalBody:(approvalRequest:ApprovalRequest) => {},
    approvalRequest: undefined
});


export const ApprovalContextProvider:React.FC<Props> = (props) => {

    const [approvalResponse, setApprovalList] = useState<ApprovalResponse[]>([]);
    const [requestResponse, setRequestResponse] = useState<ApprovalResponse[]>([]);
    const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest>();

    const getApprovalListHandler =(approvalRequest:ApprovalRequest, token:string)=>{
        const data = approvalAction.getApprovalList(token,approvalRequest);
        data.then((result) => {
            if (result !== null) {
                const response: ApprovalResponse[] = result.data;
                setApprovalList(response);
            }
        })
    }

    const getRequestListHandler =(approvalRequest:ApprovalRequest, token:string)=>{
        const data = approvalAction.getRequestList(token,approvalRequest);
        data.then((result) => {
            if (result !== null) {
                const response: ApprovalResponse[] = result.data;
                setRequestResponse(response);
            }
        })
    }

    const setApprovalBodyHandler =(approvalRequest:ApprovalRequest)=>{
        setApprovalRequest(approvalRequest);
    }

    const contextValue:Ctx = {
        getApprovalList: getApprovalListHandler
        ,getRequestList: getRequestListHandler
        ,approvalResponse
        ,requestResponse
        ,setApprovalBody : setApprovalBodyHandler
        ,approvalRequest
    }

    return (
        <ApprovalContext.Provider value={contextValue}>
            {props.children}
        </ApprovalContext.Provider>
    );
  }

export default ApprovalContext;


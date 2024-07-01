import React from "react";
import {SearchContextProvider} from "../../search/store/search-context";
import {ApprovalContextProvider} from "../store/approval-context";
import ApprovalComplete from "./approval-complete";
import ApprovalCompleteGrid from "./approval-complete-grid";


type Props = {
     visibleOption: boolean | undefined
    , pageCount: number | undefined
    , type: string | undefined
}


const ApprovalCompleteLayout:React.FC<Props> = (props) => {
  return (
      <SearchContextProvider>
          <ApprovalContextProvider>
              <React.Fragment>
                  <ApprovalComplete type={props.type}/>
                  {props.type == 'H' && (<ApprovalCompleteGrid visibleOption={props.visibleOption} pageCount={props.pageCount} type={props.type}/>)}
                  {props.type !== 'H' && (<ApprovalCompleteGrid visibleOption={true} pageCount={10} type={props.type}/>)}
              </React.Fragment>
          </ApprovalContextProvider>
      </SearchContextProvider>
  );
}

export default ApprovalCompleteLayout;
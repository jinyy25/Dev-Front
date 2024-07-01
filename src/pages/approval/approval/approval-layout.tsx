import React from "react";
import Approval from "./approval";
import ApprovalGrid from "./approval-grid";
import {ApprovalContextProvider} from "../store/approval-context";


type Props = {
     visibleOption: boolean | undefined
    , pageCount: number | undefined
    , type: string | undefined
}

const ApprovalStatusLayout:React.FC<Props> = (props) => {
  return (
          <ApprovalContextProvider>
              <React.Fragment>
                  <Approval />
                  <ApprovalGrid visibleOption={true} pageCount={10} />
              </React.Fragment>
          </ApprovalContextProvider>
  );
}

export default ApprovalStatusLayout;
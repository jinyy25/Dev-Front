import React from "react";
import {EditorContextProvider} from "../../../components/editor/editor-context"

import RecordView from "./record-view";

const RecordViewOutline =() => {
  return (
      <EditorContextProvider>
          <React.Fragment>
            <RecordView/>
          </React.Fragment>
      </EditorContextProvider>
  );
}

export default RecordViewOutline;
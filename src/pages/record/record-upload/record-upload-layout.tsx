import React from "react";
import {EditorContextProvider} from "../../../components/editor/editor-context"
import RecordUpload from "./record-upload";


const RecordUploadLayout =() => {
  return (
      <EditorContextProvider>
          <React.Fragment>
            <RecordUpload/>
          </React.Fragment>
      </EditorContextProvider>
  );
}

export default RecordUploadLayout;
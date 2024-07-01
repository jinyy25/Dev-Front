import React from "react";
import {EditorContextProvider} from "../../../components/editor/editor-context"
import ReferenceUpload from "./reference-upload"


const ReferenceUploadOutline =() => {
  return (
      <EditorContextProvider>
          <React.Fragment>
            <ReferenceUpload/>
          </React.Fragment>
      </EditorContextProvider>
  );
}

export default ReferenceUploadOutline;
import React from 'react';
import {EditorContextProvider} from "../editor/editor-context";

import AskUpload from "./ask-upload";

// Login 시작
const  AskUploadLayout = () => {

  return (
      <EditorContextProvider>
          <React.Fragment>
            <AskUpload/>
          </React.Fragment>
      </EditorContextProvider>
  );
}


export default AskUploadLayout;
import React from "react";
import {EditorContextProvider} from "../../../components/editor/editor-context"
import UploadNotice from "./notice-upload";

const NoticeViewLayout =() => {
  return (
      <EditorContextProvider>
          <React.Fragment>
            <UploadNotice/>
          </React.Fragment>
      </EditorContextProvider>
  );
}

export default NoticeViewLayout;
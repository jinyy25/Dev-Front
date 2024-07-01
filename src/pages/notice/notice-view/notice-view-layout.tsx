import React from "react";
import  {EditorContextProvider} from "../../../components/editor/editor-context"

import NoticeView from "./notice-view";

const NoticeViewLayout =() => {
  return (
      <EditorContextProvider>
          <React.Fragment>
            <NoticeView/>
          </React.Fragment>
      </EditorContextProvider>
  );
}

export default NoticeViewLayout;
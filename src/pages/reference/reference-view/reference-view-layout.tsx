import React from "react";
import {EditorContextProvider} from "../../../components/editor/editor-context"
import ReferenceView from "./reference-view";

const ReferenceViewLayout =() => {
  return (
      <EditorContextProvider>
          <React.Fragment>
            <ReferenceView/>
          </React.Fragment>
      </EditorContextProvider>
  );
}

export default ReferenceViewLayout;
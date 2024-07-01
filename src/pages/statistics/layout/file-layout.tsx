import React from "react";
import { SearchContextProvider } from "../../search/store/search-context";
import File from "../pages/file";

const FileLayout= () => {
  return (
      <SearchContextProvider>
          <React.Fragment>
              <File />
          </React.Fragment>
      </SearchContextProvider>
  );
}

export default FileLayout;
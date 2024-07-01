import React from "react";
import {useLocation} from "react-router-dom";
import SearchForm from "./search";
import { SearchContextProvider } from "../store/search-context";
import SearchGrid from './search-grid'
import FileView from "../view/file-view";


type Props = {
     visibleOption: boolean | undefined
    , pageCount: number | undefined
    , type: string | undefined
}

const SearchLayout:React.FC<Props> = (props) => {
    const location = useLocation();
    const fileCode = location.state ? location.state.fileCode : null;
    const page = location.state ? location.state.page : null;
    const pageState = location.state ? location.state.pageState : null;

  return (
      <SearchContextProvider>
          <React.Fragment>
              {pageState == 'V' ? (
                  // V  detail
                <FileView />
              ) : (
                  // grid
                <>
                  <SearchForm type={props.type} page={page}/>
                  {props.type === 'H' ? (
                      <SearchGrid
                          visibleOption={props.visibleOption}
                          pageCount={props.pageCount}
                          type={props.type}
                          mode="none"
                          fileCode={fileCode}
                      />
                  ) : (
                      <SearchGrid
                          visibleOption={true}
                          pageCount={10}
                          type={props.type}
                          mode="multiple"
                          fileCode={fileCode}
                      />
                  )}
                </>
              )}
          </React.Fragment>
      </SearchContextProvider>
  );
}

export default SearchLayout;
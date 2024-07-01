import React from "react";
import { SearchContextProvider } from "../store/search-context";
import FileView from "./file-view";

const ViewLayout = () => {
    return (
        <SearchContextProvider>
            <FileView />
        </SearchContextProvider>
    );
}

export default ViewLayout;
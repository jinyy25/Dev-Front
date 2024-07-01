import React, { useState, useEffect, useCallback, useRef } from "react";

type Props = { children?: React.ReactNode }

interface Ctx {
    setEditor: (content:string) => void;
    editorContent: string
}

const EditorContext = React.createContext<Ctx>({
    setEditor: (content:string) => {},
    editorContent: ""
})

export const EditorContextProvider:React.FC<Props> = (props) => {

    const [editorContent, setEditorContent] = useState<string>('')
    const setEditorHandler = (content:string) =>{setEditorContent(content)}
    const contextValue:Ctx = {editorContent, setEditor: setEditorHandler}

    return (
        <EditorContext.Provider value={contextValue}>
            {props.children}
        </EditorContext.Provider>
    )
  }

export default EditorContext

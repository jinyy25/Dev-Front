import React, {useContext,useState,useEffect} from 'react';
import {GET} from "../../../contexts/fetch-action";
import AuthContext from "../../../components/auth-store/auth-context";
import SearchContext from "../store/search-context";


type Props = {
     saveName : string
}

const HwpView:React.FC<Props> = (props) => {
    // 우클릭방지
    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => event.preventDefault();

    //0. Variables
    const authCtx = useContext(AuthContext);
    const searchCtx = useContext(SearchContext);
    const [fileContent, setFileContent] = useState('');

    //1. onload
    useEffect(() => {
         getHwpSlice();
     }, []);


    //2. Hwp 파일 가져오기
    const getHwpSlice = () => {
        let srcdoc =  searchCtx.fileDetail?.saveName.split('.')[0];
        const response = GET(`/api/view/${srcdoc}/index.xhtml`, {headers: {'Authorization': 'Bearer ' + authCtx.token}});
        response.then(response => {
        if (response && response.data) {
            setFileContent(response.data);
        } else {
            console.error("Error in response or data is null");
        }

        }).catch(error => {
          console.error("Error in fetching the file:", error);
      });

    }
    return(
        <>
            <div dangerouslySetInnerHTML={{__html:fileContent}}/>
        </>
    )
}

export default HwpView;
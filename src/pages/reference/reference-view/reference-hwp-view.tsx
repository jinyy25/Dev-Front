import React, {useContext,useState,useEffect} from 'react';
import {GET} from "../../../contexts/fetch-action";
import AuthContext from "../../../components/auth-store/auth-context";


type Props = {
    tmpName: string
}

const ReferenceHwpView:React.FC<Props> = (props) => {

    // 우클릭방지
    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => event.preventDefault();

    //0. Variables
    const authCtx = useContext(AuthContext);
    const [fileContent, setFileContent] = useState('');

    //1. onload
    useEffect(() => {
      getHwpSlice();
    }, []);


    //2. Hwp 파일 가져오기
    const getHwpSlice= async() => {
        let srcdoc  = props.tmpName.split('.')[0];

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
        <div className="iframe-outline"  onContextMenu={handleContextMenu}>
            <div dangerouslySetInnerHTML={{ __html: fileContent }}/>
        </div>
    )
}

export default ReferenceHwpView;

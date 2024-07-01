import React, {useContext, useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {POST} from "../../../contexts/fetch-action";
import  {jwtDecode} from 'jwt-decode';
import Box, { Item } from 'devextreme-react/box';
import TextBox from "devextreme-react/text-box";
import {Button} from "devextreme-react/button";
import AuthContext from "../../../components/auth-store/auth-context";
import '../scss/record.scss';
import Loading from '../../../components/loading/Record-Loading';

export default function RecordList(){

    //0. Variables
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [titleFile,setTitleFile] =useState("");
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [resultList, setResultList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    //동영상 화면 Resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    //1. Onload
    //마우스 우클릭 방지
    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => event.preventDefault()

    useEffect(() => {
        window.addEventListener('resize', handleResize);
       return () => {
         window.removeEventListener('resize', handleResize);
       };
     }, [window.innerWidth]);


    useEffect(() => {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        if (decodedToken?.auth?.includes('ROLE_ADMIN')) setIsButtonVisible(isButtonVisible);
        else setIsButtonVisible(!isButtonVisible);
        searchSubmit();
    }, []);

    //2. 상세화면 이동
    const clickView = (fileCode:number) =>{
        navigate('/viewrecord',{ state: { fileCode: fileCode } });
    }

    //3. Search
    const searchSubmit = () => {
        setLoading(true);
        const response = POST("/api/record/view", {titleFile:titleFile},{headers:{'Authorization': 'Bearer ' + authCtx.token}});
            response.then(response => {
            setResultList(response?.data);
            setLoading(false);
        }).catch(error => {
          console.error("Error in fetching the file:", error);
        });
    }


    return(
        <React.Fragment>
            <div className={'content-block dx-card padding-option'}>
                <div className="dx-fieldset card-outline">
                    <Box direction="col" width="100%" height={150}>
                        <Item ratio={1}>
                            <h4 className="card-title">동영상자료</h4>
                        </Item>
                        <Item ratio={1} >
                            <Box direction="row" width="100%" height={150}>
                                <Item ratio={3}>
                                    <div className="dx-field">
                                        <div className="dx-field-label">제목</div>
                                        <div className="text-option">
                                            <TextBox showClearButton={true} width="100%"
                                                     value={titleFile}
                                                     onValueChanged={(e)=>setTitleFile(e.value)}
                                            />
                                        </div>
                                    </div>
                                </Item>
                                <Item ratio={1}>
                                   <div className="dx-field buttons">
                                         <div className="button-padding">
                                           <Button
                                             width={100}
                                             text="검색"
                                             type="default"
                                             stylingMode="contained"
                                             onClick={()=>searchSubmit()}
                                           />
                                       </div>
                                        <div className="button-padding">
                                           <Button
                                               visible={isButtonVisible}
                                             width={100}
                                             text="업로드"
                                             type="default"
                                             stylingMode="outlined"
                                             onClick={()=> navigate('/record/upload')}/>
                                       </div>
                                   </div>
                               </Item>
                            </Box>
                         </Item>
                    </Box>
                </div>
            </div>

            <div className={'content-block dx-card responsive-paddings flex-option'}>
                {loading ? <Loading /> : null}
                <div className={`row g-3 ${windowWidth <= 1600 ? 'row-cols-md-3' : 'row-cols-md-4'}`}>
                        {resultList.map((dataItem, index) => (
                            <div className="rect col-padding-option" onClick={()=>clickView(dataItem.fileCode)} >
                                <div className="record-outline" onContextMenu={handleContextMenu}>
                                      <img className="bd-placeholder-img card-img-top " alt="load"
                                           src={dataItem.saveThumbname}
                                           width="100%" height="225"/>
                                      <div className="card-body">
                                           <p className="card-text">
                                               {dataItem.titleFile}
                                           </p>
                                           <small className="text-muted float-right" >
                                               {dataItem.indt}
                                           </small>
                                      </div>
                                </div>
                            </div>
                        ))}
                </div>
           </div>
        </React.Fragment>
    )
}

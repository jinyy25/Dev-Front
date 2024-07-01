import React, {useContext, useEffect, useState} from 'react';
import './profile.scss';

import ReferenceSearchGrid from "../reference/reference-search/reference-search-grid";
import {jwtDecode} from "jwt-decode";
import {POST} from "../../contexts/fetch-action";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../components/auth-store/auth-context";
import Box, {Item} from "devextreme-react/box";
import {Button} from "devextreme-react/button";


export default function Profile() {

    //0. Variables
    const authCtx = useContext(AuthContext);
    const [resultList, setResultList] = useState<any[]|undefined>([]);
    const [profile, setProfile] = useState<any>("");
    const [authority, setAuthority] = useState<any>("");

    //1. Onload
    useEffect(() => {
        searchSubmit();
        searchProfile();
    }, []);

    //2. Search
    const searchSubmit = () => {
       const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
       let userId = decodedToken?.sub

       const response = POST("/api/reference/search",{inid:userId}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
       response.then((response)=>{
           setResultList(response?.data);
       }).catch((error) =>{})

    }

    //2. Search
    const searchProfile = () => {
        const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;
        const response = POST("/api/users/profile",{userId:decodedToken?.sub}, {headers:{'Authorization': 'Bearer ' + authCtx.token}});
        response.then((response)=>{
            setProfile(response?.data);
        }).catch((error) =>{})
    }


  return (
    <React.Fragment>

      <div className={'content-block dx-card profile-paddings'}>
          <Box direction="col" width="100%" height={100}>
                 <Item ratio={1} >
                     <h4 className="card-title">Profile</h4>
                 </Item>

                <Item ratio={0.5} >
                  <Box direction="row" width="100%" height={150}>
                      <Item ratio={1}>
                          <div className="dx-field margin-option padding-10">
                              <div className="dx-field-label-50">사번 :</div>
                              <div className="dx-field-value field-width-70">
                                 {profile.userId} &nbsp; [{profile.userType}]
                              </div>
                          </div>
                      </Item>
                      <Item ratio={1}>
                        <div className="dx-field margin-option padding-10">
                            <div className="dx-field-label-50">이름 :</div>
                             <div className="dx-field-value field-width-70">
                                  {profile.userName}
                             </div>
                        </div>
                    </Item>
                      <Item ratio={1}>
                          <div className="dx-field margin-option padding-10">
                             <div className="dx-field-label label-option">마일리지 :</div>
                              <div className="dx-field-value field-width-70">
                                  {profile.mileage} point
                              </div>
                         </div>
                     </Item>
                      <Item ratio={1}>
                            <div className="dx-field margin-option padding-10">
                               <div className="dx-field-label-50 label-option">권한 :</div>
                                <div className="dx-field-value field-width-70">
                                    {profile.downType}

                                </div>
                           </div>
                          {profile.roleDuration && (
                              <div>
                                  기한 : &nbsp;  &nbsp;{profile.roleDuration}
                              </div>
                          )}
                       </Item>
                  </Box>
               </Item>

             </Box>
      </div>

        <div className={'content-block dx-card padding-option'}>
          <div className="dx-fieldset card-outline">
              <ReferenceSearchGrid visibleOption={true} pageCount={10} resultList={resultList} type={'P'}/>
         </div>
      </div>
    </React.Fragment>
  );
}



import React from 'react';
import './home.scss';
import Noticegrid from "../notice/notice-list/notice-list-grid";
import Box, {Item} from "devextreme-react/box";
import SearchList from "../search/search/search-layout";
import ApprovalStatus from "../approval/approval-complete/approval-complete-layout";

export default function Home() {
  return (
    <React.Fragment>
        <Box direction="col" width="100%" height={910}>
            <Item ratio={0.2} >
                <div className={'content-block dx-card padding-option'}>
                    <div className={'card-title-lg'}>Dashboard</div>
                </div>
            </Item>
            <Item ratio={2} baseSize={0}>
                <Box direction="row" width="100%" height='100%'>
                    <Item ratio={1.2}>
                        <div className={'content-block dx-card padding-option margin-right'}>
                            <div>
                                <h4 className="card-title-md">회사자료</h4>
                            </div>
                            <div className={'grid-height'}>
                                <SearchList visibleOption={false} pageCount={13} type={"H"} />
                            </div>
                        </div>
                    </Item>
                    <Item ratio={1}>
                        <Box direction="col" width="100%" height='100%'>
                            <Item ratio={0.55}>
                                <div className={'content-block dx-card padding-option margin-left'}>
                                    <div>
                                        <h4 className="card-title-md">공지사항</h4>
                                    </div>
                                    <Noticegrid visibleOption={false} pageCount={4} search={""} type={"H"}/>
                                </div>
                            </Item>
                            <Item ratio={0.05}></Item>
                            <Item ratio={0.55}>
                                <div className={'content-block dx-card padding-option margin-left'}>
                                    <div>
                                       <h4 className="card-title-md">승인처리현황</h4>
                                   </div>
                                    <ApprovalStatus visibleOption={false} pageCount={4} type={"H"} />
                                </div>
                            </Item>
                        </Box>
                    </Item>
                </Box>
            </Item>
        </Box>
    </React.Fragment>
)}

import React from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import './single-card.scss';
import type { SingleCardProps } from '../../types';
import Box, {Item} from "devextreme-react/box";

export default function SingleCard({ title, description, children }: React.PropsWithChildren<SingleCardProps>) {
  return (
      <div className={"scroll-option"}>
          <Box direction="row" width="100%" height="100%" >
              <Item ratio={3}>
                  <div className="image-layout">
                      <img width="100%" height="100%" className="" src='/images/main_visual1.jpg' alt="logo"/>
                      <img className="side-image" src='/images/logo.png' alt="logo"/>
                  </div>
              </Item>
              <Item ratio={1} >
                <div className={' single-card'}>
                  <div className={'dx-card'}>
                      <Box direction="col" width="100%" height="100%" >
                          <Item ratio={1}>
                              <div>
                                <img className={'float-right'}  src='/images/vtw.png' alt="logo"/>
                              </div>
                          </Item>
                          <Item ratio={2}>
                            <div className={'header'}>
                              <div className={'title title-layout'}>{}</div>
                              <div className={'description'}>{description}</div>
                                {children}
                            </div>
                          </Item>
                      </Box>
                  </div>
                </div>
              </Item>
          </Box>
      </div>
)}

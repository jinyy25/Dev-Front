import React, {useEffect, useRef, useCallback, useMemo, useContext, useState} from 'react';
import TreeView from 'devextreme-react/tree-view';
import { navigation } from '../../app-navigation';
import { useNavigation } from '../../contexts/navigation';
import { useScreenSize } from '../../utils/media-query';
import './SideNavigationMenu.scss';
import type { SideNavigationMenuProps } from '../../types';

import * as events from 'devextreme/events';
import  {jwtDecode} from 'jwt-decode';
import AuthContext from "../auth-store/auth-context";

export default function SideNavigationMenu(props: React.PropsWithChildren<SideNavigationMenuProps>) {
  const {
    children,
    selectedItemChanged,
    openMenu,
    compactMode,
    onMenuReady
  } = props;



  interface ItemType {
    expanded: boolean;
    path: string | undefined;
    text: string;
    icon: string;
    items: { text: string; path: string }[];
    visible: boolean
  }

  interface SubItemType{
    path: string;
    text: string;
    visible: boolean;
  };

  const { isLarge } = useScreenSize();
  const authCtx = useContext(AuthContext);

  function normalizePath () {
    return navigation.map((item) => (
      { ...item, expanded: isLarge, path: item.path && !(/^\//.test(item.path)) ? `/${item.path}` : item.path }
    ))

  }

  const items = useMemo(
    normalizePath,
    []
  );

  const [reItems, setItems] = useState<any>("");

  useEffect(() => {
    const decodedToken = authCtx.token ? jwtDecode(authCtx.token) : null;

      if (decodedToken?.auth?.includes('ROLE_ADMIN')) {
        items[4] = {
              ...items[4],
              visible: true
          } as ItemType;

        items[5] = {
              ...items[5],
              visible: true
          } as ItemType;


        if (items[3].items && items[3].items[0]) {
          items[3].items[0]= {
            ...items[3].items[0],
            visible: true
          }as SubItemType;
        }

    } else if(decodedToken?.auth?.includes('ROLE_APPROVAL')){
        if (items[3].items && items[3].items[0]) {
          items[3].items[0]= {
            ...items[3].items[0],
            visible: true
          }as SubItemType;
        }

        items[4] = {
              ...items[4],
              visible: false
          } as ItemType;

        items[5] = {
              ...items[5],
              visible: false
          } as ItemType


    } else {
        items[4] = {
              ...items[4],
              visible: false
          } as ItemType;

        items[5] = {
              ...items[5],
              visible: false
          } as ItemType;

        /*반출승인*/
        if (items[3].items && items[3].items[0]) {
          items[3].items[0]= {
            ...items[3].items[0],
            visible: false
          }as SubItemType;
        }
    }
      setItems(items);

  }, [authCtx.token]);





  const { navigationData: { currentPath } } = useNavigation();

  const treeViewRef = useRef<TreeView>(null);
  const wrapperRef = useRef<HTMLDivElement>();
  const getWrapperRef = useCallback((element: HTMLDivElement) => {
    const prevElement = wrapperRef.current;
    if (prevElement) {
      events.off(prevElement, 'dxclick');
    }

    wrapperRef.current = element;
    events.on(element, 'dxclick', (e: React.PointerEvent) => {
      openMenu(e);
    });
  }, [openMenu]);



  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }
    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);



  return (
    <div
      className={'dx-swatch-additional side-navigation-menu'}
      ref={getWrapperRef}
    >
      {children}
      <div className={'menu-container'}>
        <TreeView
          ref={treeViewRef}
          items={reItems}
          keyExpr={'path'}
          selectionMode={'single'}
          focusStateEnabled={false}
          expandEvent={'click'}
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width={'100%'}
        />
      </div>
    </div>
  );
}

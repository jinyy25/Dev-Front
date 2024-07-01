import { TreeViewTypes } from 'devextreme-react/tree-view';
import { ButtonTypes } from 'devextreme-react/button';
import React from 'react';

export interface HeaderProps {
    menuToggleEnabled: boolean;
    title?: string;
    toggleMenu: (e: ButtonTypes.ClickEvent) => void;
}

export interface SideNavigationMenuProps {
    selectedItemChanged: (e: TreeViewTypes.ItemClickEvent) => void;
    openMenu: (e: React.PointerEvent) => void;
    compactMode: boolean;
    onMenuReady: (e: TreeViewTypes.ContentReadyEvent) => void;
}




// 유저정보관련
export interface UserPanelProps {
    menuMode: 'context' | 'list';
}

export interface User {
    email: string;
    avatarUrl: string;
}


// User Context 내용
// isOk 사인, message 포함
export type AuthContextType = {
    user?: User;
    signIn: (email: string, password: string) => Promise<{isOk: boolean, data?: User, message?: string}>;
    signOut: () => void;
    loading: boolean;
}





//화면관련
export interface SideNavToolbarProps {
    title: string;
}

export interface SingleCardProps {
    title?: string;
    description?: string;
}

export type Handle = () => void;

interface NavigationData {
    currentPath: string;
}

export type NavigationContextType = {
    setNavigationData?: ({ currentPath }: NavigationData) => void;
    navigationData: NavigationData;
}

export type ValidationType = {
    value: string;
}
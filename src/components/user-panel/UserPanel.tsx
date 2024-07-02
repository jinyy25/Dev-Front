import React, { useMemo, useCallback, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import './UserPanel.scss';
import type { UserPanelProps } from '../../types';
import AuthContext from '../auth-store/auth-context';

const UserPanel = ({ menuMode }: UserPanelProps) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const navigateToProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  const menuItems = useMemo(() => ([
    {
      text: 'Profile',
      icon: 'user',
      onClick: navigateToProfile
    },
    {
      text: 'Logout',
      icon: 'runner',
      onClick: authCtx.logout
    }
  ]), [navigateToProfile, authCtx.logout]);

  return (
    <div className={'user-panel'}>
      <div className={'user-info'}>
        <div className={'user-name'}> [ {authCtx.userObj.userId} ]  &nbsp; {authCtx.userObj.userName}</div>
      </div>

      {menuMode === 'context' && (
        <ContextMenu
          items={menuItems}
          target={'.user-button'}
          showEvent={'dxclick'}
          width={210}
          cssClass={'user-menu'}
        >
          <Position my={{ x: 'center', y: 'top' }} at={{ x: 'center', y: 'bottom' }} />
        </ContextMenu>
      )}
      {menuMode === 'list' && (
        <List className={'dx-toolbar-menu-action'} items={menuItems} />
      )}
    </div>
  );
}

export default React.memo(UserPanel);
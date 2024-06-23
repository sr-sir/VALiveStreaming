import { useMsal } from '@azure/msal-react';
import React from 'react';
import { Dropdown } from 'react-bootstrap';

import storage from '../utils/storage';

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
  const { instance, accounts } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  };

  const handleClean = () => {
    storage.clear();
  };

  return (
    <React.Fragment>
      <Dropdown>
        <Dropdown.Toggle className="border-none bg-transparent">{accounts[0].username}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleClean}>Clean cache</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

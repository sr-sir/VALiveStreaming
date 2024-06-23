import { useMsal } from '@azure/msal-react';
import { Button } from 'react-bootstrap';

import { loginRequest } from '../authConfig';

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  return (
    <Button variant="outline-light" className="border-none" onClick={handleLogin}>
      Sign in
    </Button>
  );
};

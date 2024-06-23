// src/components/Navbar.tsx
import React from 'react';
import { Nav } from '@fluentui/react/lib/Nav';
import { INavLinkGroup } from '@fluentui/react/lib/Nav';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'LiveStreaming',
          key: 'livestreaming',
          url: '',
          onClick: () => navigate('/livestreaming')
        },
        {
          name: 'Virtual Advertising',
          key: 'virtualadvertising',
          url: '',
          onClick: () => navigate('/virtualadvertising')
        }
      ]
    }
  ];

  return (
    <Nav
      groups={navLinkGroups}
      selectedKey="key3"
      styles={{
        root: {
          width: 200,
          height: '100vh',
          boxSizing: 'border-box',
          border: '1px solid #eee',
          overflowY: 'auto',
          position: 'fixed'
        }
      }}
    />
  );
};

export default Navbar;

import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../store/types';

const Topbar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!user) return null;

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('map')) return 'Map View';
    if (path.includes('sensors')) return 'Sensor Data';
    if (path.includes('user-group')) return 'User Group';
    if (path.includes('reports')) return 'Reports';
    if (path.includes('account')) return 'Account';
    return 'Dashboard';
  };

  return (
    <div>
      <h1>{getBreadcrumb()}</h1>
      <div>Welcome, {user.name} ({user.role})</div>
    </div>
  );
};

export default Topbar;
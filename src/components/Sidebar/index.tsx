import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/types';

const Sidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/map">Map View</NavLink>
        </li>
        <li>
          <NavLink to="/sensors">Sensor Data</NavLink>
        </li>
        
        {['moderator', 'admin'].includes(user.role) && (
          <li>
            <NavLink to="/user-group">User Group</NavLink>
          </li>
        )}
        
        {['moderator', 'admin'].includes(user.role) && (
          <li>
            <NavLink to="/reports">Reports</NavLink>
          </li>
        )}
        
        <li>
          <NavLink to="/account">Account</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Account: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h2>Account Information</h2>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};

export default Account;
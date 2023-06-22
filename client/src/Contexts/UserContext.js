import React from 'react';

const UserContext = React.createContext({
  user: {username: '', token: null},
  setUser: () => {}
});

export default UserContext;
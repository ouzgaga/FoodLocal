import React from 'react';

const UserContext = React.createContext({
  name: null,
  jsToken: null,
});

export default UserContext;
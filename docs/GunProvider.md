# GunProvider

A provider for initalizing GunDB and key-based auth

### Basic Usage:

```jsx harmony
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Gun from 'gun';
import sea from 'gun/sea';
import { GunProvider } from '@altrx/gundb-react-auth';

const AppProviders = ({ children }) => {
  return (
    <Router>
      <GunProvider
        peers={['https://gun-us.herokuapp.com/gun']}
        sea={sea}
        Gun={Gun}
        keyFieldName="todoKeys"
      >
        {children}
      </GunProvider>
    </Router>
  );
};

export { AppProviders };
```

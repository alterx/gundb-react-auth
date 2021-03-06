import React, { useState, useEffect } from 'react';
import { useGun, useGunKeys, useGunKeyAuth } from '@altrx/gundb-react-hooks';

type KeyPair = {
  pub: string;
  priv: string;
  epub: string;
  epriv: string;
};

type GunContextType = {
  user;
  login: (keys: undefined | string | KeyPair) => void;
  logout: () => void;
  sea;
  appKeys: undefined | string | KeyPair;
  isLoggedIn: boolean;
  displayName: string;
  Provider;
};

type Storage = {
  getItem: (key: string) => any;
  setItem: (key: string, data: string) => any;
  removeItem: (key: string) => any;
};

type ProviderOpts = {
  Gun;
  sea;
  keyFieldName: string;
  storage: Storage;
  gunOpts;
  [key: string]: any;
};

const GunContext: GunContextType = React.createContext<GunContextType>({});
GunContext.displayName = 'GunContext';

const GunProvider = ({
  Gun,
  sea,
  keyFieldName = 'keys',
  storage,
  gunOpts,
  ...props
}: ProviderOpts) => {
  if (!sea || !Gun || !gunOpts) {
    throw new Error(`Provide gunOpts, Gun and sea`);
  }

  const [{ isReadyToAuth, existingKeys, keyStatus }, setStatuses] = useState({
    isReadyToAuth: '',
    existingKeys: null,
    keyStatus: '',
  });

  const gun = useGun(Gun, gunOpts);
  // new keypair
  const newKeys = useGunKeys(sea);
  const [user, isLoggedIn] = useGunKeyAuth(
    gun,
    existingKeys,
    isReadyToAuth === 'ready'
  );

  useEffect(() => {
    if (isLoggedIn && existingKeys && keyStatus === 'new') {
      const storeKeys = async () => {
        await storage.setItem(keyFieldName, JSON.stringify(existingKeys));
      };

      storeKeys();
    }
  }, [isLoggedIn, existingKeys, keyFieldName, storage, keyStatus, user]);

  useEffect(() => {
    if (!existingKeys) {
      const getKeys = async () => {
        const k = await storage.getItem(keyFieldName);
        const ks = JSON.parse(k || 'null');
        setStatuses({
          isReadyToAuth: 'ready',
          existingKeys: ks,
          keyStatus: ks ? 'existing' : 'new',
        });
      };
      getKeys();
    }
  }, [storage, keyFieldName, setStatuses, existingKeys]);

  const login = React.useCallback(
    async (keys) => {
      // use keys sent by the user or a new set
      setStatuses({
        isReadyToAuth: 'ready',
        existingKeys: keys || newKeys,
        keyStatus: 'new',
      });
    },
    [setStatuses, newKeys]
  );

  const logout = React.useCallback(
    (onLoggedOut) => {
      const removeKeys = async () => {
        await storage.removeItem(keyFieldName);
        onLoggedOut();
      };

      removeKeys();
    },
    [keyFieldName, storage]
  );

  const value = React.useMemo(() => {
    const newGunInstance = (opts = gunOpts) => {
      return Gun(opts);
    };
    return {
      gun,
      user,
      login,
      logout,
      sea,
      appKeys: existingKeys || newKeys,
      isLoggedIn,
      newGunInstance,
    };
  }, [
    gun,
    user,
    login,
    logout,
    sea,
    newKeys,
    existingKeys,
    isLoggedIn,
    Gun,
    gunOpts,
  ]);

  return <GunContext.Provider value={value} {...props} />;
};

function useAuth() {
  const context = React.useContext(GunContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a GunProvider`);
  }
  return context;
}

export { GunProvider, useAuth };

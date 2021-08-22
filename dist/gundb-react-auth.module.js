import React, { useState, useEffect } from 'react';

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire();
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var gundbReactHooks_umd = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
     factory(exports, React) ;
  })(commonjsGlobal, function (exports, react) {
    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends.apply(this, arguments);
    }

    var encryptData = function encryptData(data, keys, sea) {
      try {
        return Promise.resolve(keys && sea ? sea.encrypt(data, keys) : data);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    var decryptData = function decryptData(data, keys, sea) {
      try {
        return Promise.resolve(keys && sea ? sea.decrypt(data, keys) : data);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    var debouncedUpdates = function debouncedUpdates(dispatcher, timeout) {
      if (timeout === void 0) {
        timeout = 100;
      }

      var updates = [];
      var handler;
      return function (update) {
        updates.push(update);

        if (!handler) {
          handler = setTimeout(function () {
            var newStateSlice = updates.reduce(function (previousState, _ref) {
              var id = _ref.id,
                  data = _ref.data;
              previousState[id] = data;
              return previousState;
            }, {});
            dispatcher(newStateSlice);
            updates = [];
            handler = null;
          }, timeout);
        }

        return function () {
          clearTimeout(handler);
          updates = [];
          handler = null;
        };
      };
    };

    var reducer = function reducer(state, _ref2) {
      var _extends2;

      var data = _ref2.data,
          type = _ref2.type;

      switch (type) {
        case 'add':
          return _extends({}, state, data);

        case 'update':
          return _extends({}, state, (_extends2 = {}, _extends2[data.nodeID] = data, _extends2));

        case 'remove':
          delete state[data];
          return _extends({}, state);

        default:
          throw new Error();
      }
    };

    var useIsMounted = function useIsMounted() {
      var isMounted = react.useRef(false);
      react.useEffect(function () {
        isMounted.current = true;
        return function () {
          return isMounted.current = false;
        };
      }, []);
      return isMounted;
    };

    var useSafeReducer = function useSafeReducer(reducer, initialState) {
      var _useReducer = react.useReducer(reducer, initialState),
          state = _useReducer[0],
          dispatch = _useReducer[1];

      var isMounted = useIsMounted();

      function safeDispatch(args) {
        if (isMounted.current) {
          dispatch(args);
        }
      }

      return [state, safeDispatch];
    };

    var useGun = function useGun(Gun, opts) {
      var _useState = react.useState(Gun(opts)),
          gun = _useState[0];

      return [gun];
    };

    var useGunNamespace = function useGunNamespace(gun) {
      var _useState2 = react.useState(null),
          namespace = _useState2[0],
          setNamespace = _useState2[1];

      if (!namespace) {
        setNamespace(gun.user());
      }

      return [namespace];
    };

    var useGunKeyAuth = function useGunKeyAuth(gun, keys, triggerAuth) {
      if (triggerAuth === void 0) {
        triggerAuth = true;
      } // Will attempt to perform a login (when triggerAuth is set to true),
      // or, if false, returns a namespaced gun node


      var _useGunNamespace = useGunNamespace(gun),
          namespacedGraph = _useGunNamespace[0];

      var _useState3 = react.useState(false),
          isLoggedIn = _useState3[0],
          setIsLoggedIn = _useState3[1];

      gun.on('auth', function () {
        setIsLoggedIn(true);
      });
      react.useEffect(function () {
        if (namespacedGraph && !namespacedGraph.is && keys && triggerAuth) {
          namespacedGraph.auth(keys);
        }
      }, [triggerAuth, namespacedGraph, keys]);
      return [namespacedGraph, isLoggedIn];
    };

    var useGunKeys = function useGunKeys(sea, initialValue) {
      var getKeySet = function getKeySet() {
        try {
          return Promise.resolve(sea.pair()).then(function (pair) {
            setKeys(pair);
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      var _useState4 = react.useState(initialValue),
          keys = _useState4[0],
          setKeys = _useState4[1];

      if (!keys) {
        getKeySet();
      }

      return [keys, setKeys];
    };

    var useGunState = function useGunState(ref, opts) {
      if (opts === void 0) {
        opts = {
          appKeys: '',
          sea: null,
          interval: 100,
          useOpen: false
        };
      }

      var _opts = opts,
          appKeys = _opts.appKeys,
          sea = _opts.sea,
          _opts$interval = _opts.interval,
          interval = _opts$interval === void 0 ? 100 : _opts$interval,
          _opts$useOpen = _opts.useOpen,
          useOpen = _opts$useOpen === void 0 ? false : _opts$useOpen;

      var _useState5 = react.useState(ref),
          gunAppGraph = _useState5[0];

      var _useSafeReducer = useSafeReducer(reducer, {}),
          fields = _useSafeReducer[0],
          dispatch = _useSafeReducer[1];

      var handler = react.useRef(null);
      var isMounted = useIsMounted();
      react.useEffect(function () {
        var debouncedHandlers = [];

        if (isMounted.current) {
          var updater = debouncedUpdates(function (data) {
            dispatch({
              type: 'add',
              data: data
            });
          }, interval);

          var gunCb = function gunCb(encryptedField, nodeID, message, event) {
            try {
              return Promise.resolve(decryptData(encryptedField, appKeys, sea)).then(function (decryptedField) {
                Object.keys(decryptedField).forEach(function (key) {
                  var cleanFn = updater({
                    id: key,
                    data: decryptedField[key]
                  });
                  debouncedHandlers.push(cleanFn);
                });

                if (!handler.current) {
                  handler.current = event;
                }
              });
            } catch (e) {
              return Promise.reject(e);
            }
          };

          if (useOpen) {
            if (!gunAppGraph.open) {
              throw new Error('Please include gun/lib/open.');
            } else {
              gunAppGraph.open(gunCb);
            }
          } else {
            gunAppGraph.on(gunCb);
          }
        }

        return function () {
          if (handler.current) {
            //cleanup gun .on listener
            handler.current.off();
          }

          if (debouncedHandlers.length) {
            //cleanup timeouts
            debouncedHandlers.forEach(function (c) {
              return c();
            });
          }
        }; // We just need to set the listener once
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []); // Working with root node fields

      var put = function put(data) {
        try {
          return Promise.resolve(encryptData(data, appKeys, sea)).then(function (encryptedData) {
            return Promise.resolve(new Promise(function (resolve, reject) {
              return gunAppGraph.put(encryptedData, function (ack) {
                return ack.err ? reject(ack.err) : resolve();
              });
            })).then(function () {});
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      var remove = function remove(field) {
        try {
          return Promise.resolve(new Promise(function (resolve, reject) {
            return gunAppGraph.put(null, function (ack) {
              return ack.err ? reject(ack.err) : resolve();
            });
          })).then(function () {
            dispatch({
              type: 'remove',
              data: field
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      return {
        fields: fields,
        put: put,
        remove: remove
      };
    };

    var useGunCollectionState = function useGunCollectionState(ref, opts) {
      if (opts === void 0) {
        opts = {
          appKeys: '',
          sea: null,
          interval: 100,
          useOpen: false
        };
      }

      var _opts2 = opts,
          appKeys = _opts2.appKeys,
          sea = _opts2.sea,
          _opts2$interval = _opts2.interval,
          interval = _opts2$interval === void 0 ? 100 : _opts2$interval,
          useOpen = _opts2.useOpen;

      var _useState6 = react.useState(ref),
          gunAppGraph = _useState6[0];

      var _useSafeReducer2 = useSafeReducer(reducer, {}),
          collection = _useSafeReducer2[0],
          dispatch = _useSafeReducer2[1];

      var handler = react.useRef(null);
      var isMounted = useIsMounted(); // Working with Sets

      react.useEffect(function () {
        var debouncedHandlers = [];

        if (isMounted.current) {
          var updater = debouncedUpdates(function (data) {
            dispatch({
              type: 'add',
              data: data
            });
          }, interval);

          var gunCb = function gunCb(encryptedNode, nodeID, message, event) {
            try {
              return Promise.resolve(decryptData(encryptedNode, appKeys, sea)).then(function (item) {
                if (item) {
                  var cleanFn = updater({
                    id: nodeID,
                    data: _extends({}, item, {
                      nodeID: nodeID
                    })
                  });
                  debouncedHandlers.push(cleanFn);
                }

                if (!handler.current) {
                  handler.current = event;
                }
              });
            } catch (e) {
              return Promise.reject(e);
            }
          };

          if (useOpen) {
            if (!gunAppGraph.open) {
              throw new Error('Please include gun/lib/open.');
            } else {
              gunAppGraph.map().open(gunCb);
            }
          } else {
            gunAppGraph.map().on(gunCb);
          }
        }

        return function () {
          if (handler.current) {
            //cleanup gun .on listener
            handler.current.off();
          }

          if (debouncedHandlers.length) {
            //cleanup timeouts
            debouncedHandlers.forEach(function (c) {
              return c();
            });
          }
        }; // We just need to set the listener once
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      var updateInSet = function updateInSet(nodeID, data) {
        try {
          return Promise.resolve(encryptData(data, appKeys, sea)).then(function (encryptedData) {
            return Promise.resolve(new Promise(function (resolve, reject) {
              return gunAppGraph.get(nodeID).put(encryptedData, function (ack) {
                return ack.err ? reject(ack.err) : resolve();
              });
            })).then(function () {
              dispatch({
                type: 'update',
                data: _extends({
                  nodeID: nodeID
                }, data)
              });
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      var addToSet = function addToSet(data, nodeID) {
        try {
          return Promise.resolve(encryptData(data, appKeys, sea)).then(function (encryptedData) {
            var _temp = function () {
              if (!nodeID) {
                return Promise.resolve(new Promise(function (resolve, reject) {
                  return gunAppGraph.set(encryptedData, function (ack) {
                    return ack.err ? reject(ack.err) : resolve();
                  });
                })).then(function () {});
              } else {
                return Promise.resolve(new Promise(function (resolve, reject) {
                  return gunAppGraph.get(nodeID).put(encryptedData, function (ack) {
                    return ack.err ? reject(ack.err) : resolve();
                  });
                })).then(function () {});
              }
            }();

            if (_temp && _temp.then) return _temp.then(function () {});
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      var removeFromSet = function removeFromSet(nodeID) {
        try {
          return Promise.resolve(new Promise(function (resolve, reject) {
            return gunAppGraph.get(nodeID).put(null, function (ack) {
              return ack.err ? reject(ack.err) : resolve();
            });
          })).then(function () {});
        } catch (e) {
          return Promise.reject(e);
        }
      };

      return {
        collection: collection,
        addToSet: addToSet,
        updateInSet: updateInSet,
        removeFromSet: removeFromSet
      };
    };

    exports.debouncedUpdates = debouncedUpdates;
    exports.decryptData = decryptData;
    exports.encryptData = encryptData;
    exports.reducer = reducer;
    exports.useGun = useGun;
    exports.useGunCollectionState = useGunCollectionState;
    exports.useGunKeyAuth = useGunKeyAuth;
    exports.useGunKeys = useGunKeys;
    exports.useGunNamespace = useGunNamespace;
    exports.useGunState = useGunState;
    exports.useIsMounted = useIsMounted;
    exports.useSafeReducer = useSafeReducer;
  });
});

var GunContext = React.createContext({});
GunContext.displayName = 'GunContext';

var GunProvider = function GunProvider(_ref) {
  var peers = _ref.peers,
      Gun = _ref.Gun,
      sea = _ref.sea,
      _ref$keyFieldName = _ref.keyFieldName,
      keyFieldName = _ref$keyFieldName === void 0 ? 'keys' : _ref$keyFieldName,
      storage = _ref.storage,
      gunOpts = _ref.gunOpts,
      props = _objectWithoutPropertiesLoose(_ref, ["peers", "Gun", "sea", "keyFieldName", "storage", "gunOpts"]);

  if (!sea || !Gun || !peers) {
    throw new Error("Provide peers, Gun and sea");
  }

  var newGunInstance = function newGunInstance(opts) {
    if (opts === void 0) {
      opts = {
        peers: peers
      };
    }

    return Gun(opts);
  };

  var _useState = useState(''),
      isReadyToAuth = _useState[0],
      setReadyToAuth = _useState[1];

  var _useState2 = useState(''),
      existingKeysStatus = _useState2[0],
      setExistingKeysStatus = _useState2[1];

  var _useGun = gundbReactHooks_umd.useGun(Gun, gunOpts || {
    peers: peers
  }),
      gun = _useGun[0];

  var _useGunKeys = gundbReactHooks_umd.useGunKeys(sea, null),
      appKeys = _useGunKeys[0],
      setAppKeys = _useGunKeys[1];

  var _useGunKeyAuth = gundbReactHooks_umd.useGunKeyAuth(gun, appKeys, isReadyToAuth === 'ready'),
      user = _useGunKeyAuth[0],
      isLoggedIn = _useGunKeyAuth[1];

  useEffect(function () {
    if (isLoggedIn && existingKeysStatus === 'notpresent') {
      var storeKeys = function storeKeys() {
        try {
          return Promise.resolve(storage.setItem(keyFieldName, JSON.stringify(appKeys))).then(function () {});
        } catch (e) {
          return Promise.reject(e);
        }
      };

      storeKeys();
    }
  }, [isLoggedIn, appKeys, existingKeysStatus, keyFieldName, storage]);
  useEffect(function () {
    if (existingKeysStatus === '') {
      var getKeys = function getKeys() {
        try {
          return Promise.resolve(storage.getItem(keyFieldName)).then(function (k) {
            var ks = JSON.parse(k || 'null');
            setAppKeys(ks);
            setExistingKeysStatus(ks ? 'present' : 'notpresent');
            setReadyToAuth('ready');
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      getKeys();
    }
  }, [storage, keyFieldName, existingKeysStatus, setExistingKeysStatus, setReadyToAuth, setAppKeys]);
  var login = React.useCallback(function (keys) {
    try {
      if (keys) {
        // This function is called when the user inputs existing
        // keys. In that case, we wanna make sure `appKeys` contains those instead
        // of the ones that were generated by the `useGunKeys` hook.
        setAppKeys(keys);
      } // We tell Gun we're ready to perform the authentication, either with existing
      // keys or the ones generated by the `useGunKeys` hook.


      setReadyToAuth('ready');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }, [setAppKeys, existingKeysStatus, setReadyToAuth]);
  var logout = React.useCallback(function () {
    var removeKeys = function removeKeys() {
      try {
        return Promise.resolve(storage.removeItem(keyFieldName)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    removeKeys();
  }, []);
  var value = React.useMemo(function () {
    return {
      user: user,
      login: login,
      logout: logout,
      sea: sea,
      appKeys: appKeys,
      isLoggedIn: isLoggedIn,
      newGunInstance: newGunInstance
    };
  }, [login, logout, user, appKeys, isLoggedIn, newGunInstance]);
  return React.createElement(GunContext.Provider, Object.assign({
    value: value
  }, props));
};

function useAuth() {
  var context = React.useContext(GunContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a GunProvider");
  }

  return context;
}

export { GunProvider, useAuth };
//# sourceMappingURL=gundb-react-auth.module.js.map

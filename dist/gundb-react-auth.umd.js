(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global['@altrx/gundb-react-auth'] = {}, global.react));
}(this, (function (exports, React) {
  var React__default = 'default' in React ? React['default'] : React;

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
       factory(exports, React__default) ;
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
        var _useState = react.useState(Gun(_extends({}, opts))),
            gun = _useState[0],
            setGun = _useState[1];

        react.useEffect(function () {
          if (opts) {
            setGun(Gun(_extends({}, opts)));
          }
        }, [Gun, opts]);
        return gun;
      };

      var useGunNamespace = function useGunNamespace(gun, soul) {
        var _useState2 = react.useState(soul ? gun.user(soul) : gun.user()),
            namespace = _useState2[0],
            setNamespace = _useState2[1];

        react.useEffect(function () {
          if (gun && !namespace) {
            setNamespace(soul ? gun.user(soul) : gun.user());
          }
        }, [namespace, gun, soul]);
        return namespace;
      };

      var useGunKeyAuth = function useGunKeyAuth(gun, keys, triggerAuth) {
        if (triggerAuth === void 0) {
          triggerAuth = true;
        } // Will attempt to perform a login (when triggerAuth is set to true),
        // or, if false, returns a namespaced gun node


        var namespacedGraph = useGunNamespace(gun);

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

      var useGunKeys = function useGunKeys(sea, existingKeys) {
        var _useState4 = react.useState(existingKeys),
            newKeys = _useState4[0],
            setNewKeys = _useState4[1];

        react.useEffect(function () {
          var getKeySet = function getKeySet() {
            try {
              return Promise.resolve(sea.pair()).then(function (pair) {
                setNewKeys(pair);
              });
            } catch (e) {
              return Promise.reject(e);
            }
          };

          if (!newKeys && !existingKeys) {
            getKeySet();
          }

          if (existingKeys) {
            setNewKeys(existingKeys);
          }
        }, [existingKeys, newKeys, sea]);
        return newKeys;
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
                  return ack.err ? reject(ack.err) : resolve(data);
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
                return ack.err ? reject(ack.err) : resolve(field);
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
                  return ack.err ? reject(ack.err) : resolve(data);
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
                      return ack.err ? reject(ack.err) : resolve(data);
                    });
                  })).then(function () {});
                } else {
                  return Promise.resolve(new Promise(function (resolve, reject) {
                    return gunAppGraph.get(nodeID).put(encryptedData, function (ack) {
                      return ack.err ? reject(ack.err) : resolve(data);
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
                return ack.err ? reject(ack.err) : resolve(nodeID);
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

  var GunContext = React__default.createContext({});
  GunContext.displayName = 'GunContext';

  var GunProvider = function GunProvider(_ref) {
    var Gun = _ref.Gun,
        sea = _ref.sea,
        _ref$keyFieldName = _ref.keyFieldName,
        keyFieldName = _ref$keyFieldName === void 0 ? 'keys' : _ref$keyFieldName,
        storage = _ref.storage,
        gunOpts = _ref.gunOpts,
        props = _objectWithoutPropertiesLoose(_ref, ["Gun", "sea", "keyFieldName", "storage", "gunOpts"]);

    if (!sea || !Gun || !gunOpts) {
      throw new Error("Provide gunOpts, Gun and sea");
    }

    var _useState = React.useState({
      isReadyToAuth: '',
      existingKeys: null,
      keyStatus: ''
    }),
        _useState$ = _useState[0],
        isReadyToAuth = _useState$.isReadyToAuth,
        existingKeys = _useState$.existingKeys,
        keyStatus = _useState$.keyStatus,
        setStatuses = _useState[1];

    var gun = gundbReactHooks_umd.useGun(Gun, gunOpts); // new keypair

    var newKeys = gundbReactHooks_umd.useGunKeys(sea);

    var _useGunKeyAuth = gundbReactHooks_umd.useGunKeyAuth(gun, existingKeys, isReadyToAuth === 'ready'),
        user = _useGunKeyAuth[0],
        isLoggedIn = _useGunKeyAuth[1];

    React.useEffect(function () {
      if (isLoggedIn && existingKeys && keyStatus === 'new') {
        var storeKeys = function storeKeys() {
          try {
            return Promise.resolve(storage.setItem(keyFieldName, JSON.stringify(existingKeys))).then(function () {});
          } catch (e) {
            return Promise.reject(e);
          }
        };

        storeKeys();
      }
    }, [isLoggedIn, existingKeys, keyFieldName, storage, keyStatus, user]);
    React.useEffect(function () {
      if (!existingKeys) {
        var getKeys = function getKeys() {
          try {
            return Promise.resolve(storage.getItem(keyFieldName)).then(function (k) {
              var ks = JSON.parse(k || 'null');
              setStatuses({
                isReadyToAuth: 'ready',
                existingKeys: ks,
                keyStatus: ks ? 'existing' : 'new'
              });
            });
          } catch (e) {
            return Promise.reject(e);
          }
        };

        getKeys();
      }
    }, [storage, keyFieldName, setStatuses, existingKeys]);
    var login = React__default.useCallback(function (keys) {
      try {
        // use keys sent by the user or a new set
        setStatuses({
          isReadyToAuth: 'ready',
          existingKeys: keys || newKeys,
          keyStatus: 'new'
        });
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    }, [setStatuses, newKeys]);
    var logout = React__default.useCallback(function (onLoggedOut) {
      var removeKeys = function removeKeys() {
        try {
          return Promise.resolve(storage.removeItem(keyFieldName)).then(function () {
            onLoggedOut();
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      removeKeys();
    }, [keyFieldName, storage]);
    var value = React__default.useMemo(function () {
      var newGunInstance = function newGunInstance(opts) {
        if (opts === void 0) {
          opts = gunOpts;
        }

        return Gun(opts);
      };

      return {
        gun: gun,
        user: user,
        login: login,
        logout: logout,
        sea: sea,
        appKeys: existingKeys || newKeys,
        isLoggedIn: isLoggedIn,
        newGunInstance: newGunInstance
      };
    }, [gun, user, login, logout, sea, newKeys, existingKeys, isLoggedIn, Gun, gunOpts]);
    return React__default.createElement(GunContext.Provider, Object.assign({
      value: value
    }, props));
  };

  function useAuth() {
    var context = React__default.useContext(GunContext);

    if (context === undefined) {
      throw new Error("useAuth must be used within a GunProvider");
    }

    return context;
  }

  exports.GunProvider = GunProvider;
  exports.useAuth = useAuth;

})));
//# sourceMappingURL=gundb-react-auth.umd.js.map

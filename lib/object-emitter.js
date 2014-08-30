/**
 * Object Channels
 *
 * Create EventChannel channels.
 *
 * @version 0.1.0
 * @module object-channel
 * @author potanin@UD
 * @constructor
 */
require( 'abstract' ).createModel( module.exports = function ObjectEmitter() {

  // Private Modules.
  var domain      = require( 'domain' );
  var util        = require( 'util' );
  var _defaults   = require( 'abstract' ).utility.defaults;

  /**
   * Identity Delimiter in Object.
   *
   * @param context
   * @param _delimiter
   * @returns {*}
   */
  function getDelimiter( context, _delimiter ) {

    if( context.delimiter ) {
      return context.delimiter;
    }

    if( context._conf && context._conf.delimiter ) {
      _delimiter = context._conf.delimiter;
    }

    if( !_delimiter && ( 'function' === typeof context.get && context._meta ) ) {
      _delimiter = context.get( 'emitter.delimiter', '.' );
    }

    if( !_delimiter ) {
      _delimiter = '.';
    }

    return _delimiter;

  }

  /**
   * Set Configuraiton (_conf)
   *
   * @param _context
   * @param _conf
   * @returns {{}}
   */
  function setConfig( _context, _conf ) {

    _context = _context || {};

    _conf = _defaults( _conf || {}, {
      delimiter: ':',
      maxListeners: 20,
      wildcard: true,
      usingDomains: false,
      throwErrors: false
    })

    try {

      Object.defineProperty( _context, '_conf', {
        value: _conf,
        enumerable: false,
        configurable: true,
        writable: true
      });

    } catch( error ) {
      return _context;
    }

    return _context;

  }

  // Construct Model only once.
  if( module.loaded ) {
    return ObjectEmitter;
  }

  /**
   * Instance Properties
   *
   */
  ObjectEmitter.defineProperties( ObjectEmitter, {
    inject: {
      /**
       * Force / Override properties
       *
       * If object not provided will bind to context.
       *
       * @todo Migrate structure conversion logic into seperate method.
       *
       * @param {Object} obj
       * @return {Object}
       */
      value: function inject( obj, _conf ) {

        var Instance = new ObjectEmitter.create();

        var _events = Object.defineProperties( obj, {
          _events: {
            value: obj._events,
            enumerable: false,
            configurable: false,
            writable: true
          }
        });

        Object.getOwnPropertyNames( ObjectEmitter.prototype ).forEach( function( key ) {

          var descriptor = Object.getOwnPropertyDescriptor( obj, key );

          Object.defineProperty( obj, key, {
            value: Instance[ key ],
            enumerable: descriptor ? descriptor.enumerable : false,
            writable: true,
            configurable: true
          });

        });

        // Ensure we have an listener container.

        Object.defineProperty( obj, '_events', {
          value: _events,
          enumerable: false,
          configurable: true,
          writable: true
        });

        // Convert Structure from standard to nested.
        for( var _tag in _events ) {

          if( 'function' === typeof _events[ _tag ] ) {
            obj.on( _tag, _events[ _tag ] );
          }

          if( Object.prototype.toString.call( _events[ _tag ] ) === '[object Array]' ) {

            _events[ _tag ].forEach( function( method ) {
              obj.on( _tag, method );
            })

          }

          }

        setConfig( obj, _conf );

        return obj;

      },
      enumerable: true,
      configurable: true,
      writable: true
    },
    include: {
      /**
       * Include Instantiated ClusterEmitter
       *
       * If object not provided will bind to context.
       *
       * @param {Object} obj
       * @return {Object}
       */
      value: function include( obj, _conf ) {

        var target = obj || this;
        var Instance = new ObjectEmitter.create();

        for( var key in Instance ) {

          Object.defineProperty( target, key, {
            value: target[ key ] || Instance[ key ],
            enumerable: false,
            writable: true,
            configurable: true
          });

        }

        // Ensure we have an listener container.
        if( !target._events ) {

          Object.defineProperty( target, '_events', {
            value: {},
            enumerable: false,
            configurable: true,
            writable: true
          });

        }

        setConfig( target, _conf );

        return target;

      },
      enumerable: true,
      configurable: true,
      writable: true
    },
    mixin: {
      /**
       * Mixin the Emitter properties.
       *
       * @param {Object} obj
       * @return {Object}
       */
      value: function mixin( obj, _conf ) {

        for( var key in ObjectEmitter.prototype ) {

          var descriptor = Object.getOwnPropertyDescriptor( obj, key );

          // Detect if a property is not configurable.
          if( descriptor && !descriptor.configurable ) {
            break;
          }

          try {

            Object.defineProperty( obj, key, {
              value: obj[ key ] || ObjectEmitter.prototype[ key ],
              enumerable: false,
              writable: true,
              configurable: true
            });

          } catch( error ) {}

        }

        // Ensure we have an listener container.
        if( !obj._events ) {

          Object.defineProperty( obj, '_events', {
            value: {},
            enumerable: false,
            configurable: true,
            writable: true
          });

        }

        setConfig( obj, _conf );

        return obj;

      },
      enumerable: true,
      configurable: true,
      writable: true
    },
    eventify: {
      /**
       * Wrap Object's Methods into Events
       *
       * @param target
       * @param namespace
       * @param options
       * @returns {*}
       */
      value: function eventify( target, namespace, options ) {

        // Enable EventChannel
        ObjectEmitter.extend( target, namespace, options );

        // Trigger Method on Event
        Object.getOwnPropertyName( target ).forEach( function( method ) {

          // @todo Should probably exclude all EE methods from being bound
          if( method !== 'on' && method != 'emit' && 'function' === typeof target[ method ] ) {
            target.on( method, target[ method ] );
          }

        });

        return this;

      },
      enumerable: true,
      configurable: true,
      writable: true
    }
  });

  /**
   * Constructor Properties
   *
   * The following properties are available within the constructor factory or by
   * referencing the constructor.
   *
   */
  ObjectEmitter.defineProperties( ObjectEmitter.prototype, {

    /**
     *
     * @param event
     * @param fn
     * @returns {*}
     */
    once: function once( event, fn ) {
      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1] );
      return this.many( event, 1, fn );
    },

    /**
     *
     * @param event
     * @param ttl
     * @param fn
     * @returns {*}
     */
    many: function many( event, ttl, fn ) {
      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1], typeof arguments[2] );

      var self = this;

      if( typeof fn !== 'function' ) {
        throw new Error( 'many only accepts instances of Function' );
      }

      function listener() {

        if( --ttl === 0 ) {
          self.off( event, listener );
        }

        fn.apply( this, arguments );
      };

      listener._origin = fn;

      this.on( event, listener );

      return this;
    },

    /**
     *
     * @returns {*}
     */
    emit: function emit() {
      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] );

      var _delimiter = getDelimiter( this );

      if( !this._events ) {

        Object.defineProperty( this, '_events', {
          value: {},
          enumerable: false,
          configurable: true,
          writable: true
        });

      }

      // If event storage is still not set, it must be uneditable.
      if( !this._events ) {
        return this;
      }

      var type = arguments[0] && 'object' === typeof arguments[0] && Object.keys( arguments[0] ).length ? arguments[0].join( _delimiter ) : arguments[0];

      if( !this._events ) {

        Object.defineProperty( obj, '_events', {
          value: {},
          enumerable: false,
          configurable: true,
          writable: true
        });

      }

      // Loop through the ** functions and invoke them.
      if( ( this._events[ '#' ] && this._events[ '#' ].length ) || ( this._events[ '**' ] && this._events[ '**' ].length ) ) {
        var l = arguments.length;
        var __length = this._events[ '#' ].length || this._events[ '**' ].length;
        var args = new Array( l - 1 );
        for( var i = 1; i < l; i++ ) {
          args[i - 1] = arguments[i];
        }
        for( i = 0, l = __length; i < l; i++ ) {
          this.event = type;

          if( this._events[ '#' ] ) {
            this._events[ '#' ][i].apply( this, args );
          } else if ( this._events[ '**' ] ) {
            this._events[ '**' ][i].apply( this, args );
          }

        }
      }

      if (type === 'error') {

        if (!this._all && !this._events.error && !(this.wildcard && this.listenerTree.error)) {

          // Ignore uncaught error events.
          if( this._conf && this._conf.throwErrors === false ) {
            return this
          }

          if (arguments[1] instanceof Error) {
            throw arguments[1]; // Unhandled 'error' event
          } else {
            throw new Error("Uncaught, unspecified 'error' event.");
          }

          return this;

        }
      }

      var handler = [];

      if( 'undefined' === typeof type ) {
        console.error( 'type is undefined' );
        return this;
      }

      var ns = typeof type === 'string' ? type.split( _delimiter ) : type.slice();

      if( !this.searchListenerTree ) {
        console.error( 'Missing searchListenerTree()' );
        this.searchListenerTree = ObjectEmitter.prototype.searchListenerTree.bind( this );
      }

      this.searchListenerTree( handler, ns, this._events, 0 );

      if( typeof handler === 'function' ) {
        //// ObjectEmitter.logger.debug( '%s() handler %s IS a function', arguments.callee.name, type );
        this.event = type;
        if( arguments.length === 1 ) {
          handler.call( this );
        } else if( arguments.length > 1 ) {
          switch( arguments.length ) {
            case 2:
              handler.call( this, arguments[1] );
              break;
            case 3:
              handler.call( this, arguments[1], arguments[2] );
              break;
            // slower
            default:
              var l = arguments.length;
              var args = new Array( l - 1 );
              for( var i = 1; i < l; i++ ) {
                args[i - 1] = arguments[i];
              }
              handler.apply( this, args );
          }
        }
      } else if( handler ) {
        //// ObjectEmitter.logger.debug( '%s() handler %s is not a function', arguments.callee.name, type );
        var l = arguments.length;
        var args = new Array( l - 1 );
        for( var i = 1; i < l; i++ ) {
          args[i - 1] = arguments[i];
        }
        var listeners = handler.slice();
        for( var i = 0, l = listeners.length; i < l; i++ ) {
          this.event = type;
          listeners[i].apply( this, args );
        }
      }

      return this;

    },

    /**
     * Add Listener
     *
     * @param type
     * @param listener
     * @returns {*}
     */
    on: function on( type, listener ) {
      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] )

      var _delimiter = getDelimiter( this );

      if( type === '#' ) {
        type = '**';
      }

      // If no type specified, assume we are creating an all-event listener
      if( typeof type === 'function' ) {
        listener = type;
        type = '#';
      }

      if( typeof listener !== 'function' ) {
        // ObjectEmitter.logger.error( this.constructor.name, ':', arguments.callee.name, ' - callback must be typeof function, not', typeof listener, 'as provided.' )

        if( this.settings.throw ) {
          throw new Error( 'on only accepts instances of Function' );
        } else { return this; }

      }

      this._events || ObjectEmitter.call( this );

      type = typeof type === 'string' ? type.split( _delimiter ).filter( function() { return arguments[0]; }) : type.slice();

      for( var i = 0, len = type.length; i + 1 < len; i++ ) {
        if( type[i] === '#' && type[i + 1] === '#' ) { return this; }
        if( type[i] === '**' && type[i + 1] === '**' ) { return this; }
      }

      var tree = this._events = this._events || {};

      var name = type.shift();

      while( name ) {

        if( !tree[name] ) {
          tree[name] = {};
        }

        tree = tree[name];

        if( type.length === 0 ) {

          if( !tree._listeners ) {
            tree._listeners = listener;
          } else if( typeof tree._listeners === 'function' ) {
            tree._listeners = [tree._listeners, listener];
          } else if( Array.isArray( tree._listeners ) ) {

            tree._listeners.push( listener );

            if( !tree._listeners.warned ) {

              var m = this.maxListeners;

              if( typeof this._events.maxListeners !== 'undefined' ) {
                m = this._events.maxListeners;
              }

              if( m > 0 && tree._listeners.length > m ) {
                tree._listeners.warned = true;
                console.error( '(node) warning: possible emitter leak.', tree._listeners.length );
              }

            }
          }

          return this;

        }

        name = type.shift();

      }

      return this;

    },

    /**
     * Remove Listener
     *
     * @param type
     * @param listener
     * @returns {*}
     */
    off: function off( type, listener ) {
      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1] )

      var _delimiter = getDelimiter( this );

      if( typeof listener !== 'function' ) {
        throw new Error( 'removeListener only takes instances of Function' );
      }

      var handlers, leafs = [];

      var ns = typeof type === 'string' ? type.split( _delimiter ) : type.slice();

      leafs = this.searchListenerTree( null, ns, this._events, 0 );

      for( var iLeaf = 0; iLeaf < leafs.length; iLeaf++ ) {
        var leaf = leafs[iLeaf];
        handlers = leaf._listeners;
        if( Array.isArray( handlers ) ) {

          var position = -1;

          for( var i = 0, length = handlers.length; i < length; i++ ) {
            if( handlers[i] === listener || (handlers[i].listener && handlers[i].listener === listener) || (handlers[i]._origin && handlers[i]._origin === listener) ) {
              position = i;
              break;
            }
          }

          if( position < 0 ) {
            return this;
          }

          leaf._listeners.splice( position, 1 )

          if( handlers.length === 0 ) {
            delete leaf._listeners;
          }

        } else if( handlers === listener || (handlers.listener && handlers.listener === listener) || (handlers._origin && handlers._origin === listener) ) {
          delete leaf._listeners;
        }
      }

      return this;
    },

    /**
     * Remove All Listeners
     *
     * @param type
     * @returns {*}
     */
    removeAllListeners: function removeAllListeners( type ) {

      var _delimiter = getDelimiter( this );

      if( arguments.length === 0 ) {
        !this._events || ObjectEmitter.call( this );
        return this;
      }

      var ns = typeof type === 'string' ? type.split( _delimiter ) : type.slice();
      var leafs = this.searchListenerTree( null, ns, this._events, 0 );

      for( var iLeaf = 0; iLeaf < leafs.length; iLeaf++ ) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }

      return this;

    },

    /**
     * Get Listeners
     *
     * @param type
     * @returns {Array}
     */
    listeners: function listeners( type ) {
      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] );

      var _delimiter = getDelimiter( this );

      var handlers = [];
      var ns = typeof type === 'string' ? type.split( _delimiter ) : type.slice();

      this.searchListenerTree( handlers, ns, this._events, 0 );

      return handlers;

    },

    searchListenerTree: {
      /**
       * Search Listener Tree
       * @param handlers
       * @param type
       * @param tree
       * @param i
       * @returns {Array}
       */
      value: function searchListenerTree( handlers, type, tree, i ) {
        // ObjectEmitter.logger.debug( arguments.callee.name, handlers, type, typeof tree, i );

        if( !tree ) {
          return [];
        }

        var self = this;

        var listeners = [], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached, typeLength = type.length, currentType = type[i], nextType = type[i + 1];

        if( i === typeLength && tree._listeners ) {

          if( typeof tree._listeners === 'function' ) {
            handlers && handlers.push( tree._listeners );
            return [tree];

          } else {
            for( leaf = 0, len = tree._listeners.length; leaf < len; leaf++ ) {
              handlers && handlers.push( tree._listeners[leaf] );
            }
            return [tree];
          }

        }

        if( ( currentType === '*' || currentType === '**' || currentType === '#' ) || tree[ currentType ] ) {

          if( currentType === '*' ) {
            for( branch in tree ) {
              if( branch !== '_listeners' && tree.hasOwnProperty( branch ) ) {
                listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i + 1 ) );
              }
            }
            return listeners;

          } else if( currentType === '**' || currentType === '#' ) {
            endReached = (i + 1 === typeLength || (i + 2 === typeLength && nextType === '*'));
            if( endReached && tree._listeners ) {
              // The next element has a _listeners, add it to the handlers.
              listeners = listeners.concat( this.searchListenerTree( handlers, type, tree, typeLength ) );
            }

            for( branch in tree ) {
              if( branch !== '_listeners' && tree.hasOwnProperty( branch ) ) {
                if( branch === '*' || ( branch === '**' || branch === '#' ) ) {
                  if( tree[branch]._listeners && !endReached ) {
                    listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], typeLength ) );
                  }
                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i ) );
                } else if( branch === nextType ) {
                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i + 2 ) );
                } else {
                  // No match on this one, shift into the tree but not in the type array.
                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i ) );
                }
              }
            }
            return listeners;
          }

          listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[currentType], i + 1 ) );

        }

        xTree = tree['*'];

        if( xTree ) {
          this.searchListenerTree( handlers, type, xTree, i + 1 );
        }

        xxTree = tree[ '**' ];

        if( xxTree ) {
          if( i < typeLength ) {

            if( xxTree._listeners ) {
              this.searchListenerTree( handlers, type, xxTree, typeLength );
            }

            // Build arrays of matching next branches and others.
            for( branch in xxTree ) {
              if( branch !== '_listeners' && xxTree.hasOwnProperty( branch ) ) {
                if( branch === nextType ) {
                  // We know the next element will match, so jump twice.
                  this.searchListenerTree( handlers, type, xxTree[branch], i + 2 );
                } else if( branch === currentType ) {
                  // Current node matches, move into the tree.
                  this.searchListenerTree( handlers, type, xxTree[branch], i + 1 );
                } else {
                  isolatedBranch = {};
                  isolatedBranch[branch] = xxTree[branch];
                  this.searchListenerTree( handlers, type, { '#': isolatedBranch }, i + 1 );
                }
              }
            }
          } else if( xxTree._listeners ) {
            // We have reached the end and still on a '#'
            this.searchListenerTree( handlers, type, xxTree, typeLength );
          } else if( xxTree['*'] && xxTree['*']._listeners ) {
            this.searchListenerTree( handlers, type, xxTree['*'], typeLength );
          }
        }

        return listeners;

      },
      writable: true,
      configurable: true,
      enumerable: true
    }

  });

  /**
   * Emitter Constructor.
   *
   */
  ObjectEmitter.defineConstructor( function create( options ) {
    var Instance = this;

    setConfig( Instance, options );

    Object.defineProperties( Instance, {
      _events: {
        value: {},
        enumerable: false,
        configurable: true,
        writable: true
      }
    });

    //console.log( require( 'util').inspect( Instance._conf, { colors: true , depth:5, showHidden: false } ) );
    // if there is an active domain, then attach to it.
    if( ( this._conf && this._conf.usingDomain ) || 'function' === typeof this.get && 'object' === typeof this._meta && Instance.get( 'usingDomains' ) ) {

      domain = domain || require( 'domain' );

      if( domain.active && !( Instance instanceof domain.Domain )) {

        Instance.properties({
          domain: {
            value: domain.active,
            enumerable: false
          }
        });

      }

    }

    return Instance;

  });

});

/**
 * Object Channels
 *
 * Create EventChannel channels.
 *
 * @version 0.0.3
 * @module object-channel
 * @author potanin@UD
 * @constructor
 */
require( 'abstract' ).createModel( function Channel( Channel, prototype ) {

  // Expose
  module.exports = Channel;

  // Set Defaults
  Channel.set( 'defaults', {
    delimiter: '.',
    wildcard: true,
    maxListeners: 20
  });

  Channel.properties({
    /**
     * Set Defaults
     *
     * @param defaults
     * @returns {Object} Instance.
     */
    defaults: function( defaults ) {
      return Channel.set( 'defaults', defaults );
    },
    /**
     * Add Event wrappers to an Object's properties
     *
     * @method eventify
     * @chainable
     */
    eventify: function eventify( target, namespace, options ) {

      // Enable EventChannel
      Channel.extend( target, namespace, options );

      // Trigger Method on Event
      Object.getOwnPropertyName( target ).forEach( function( method ) {

        // @todo Should probably exclude all EE methods from being bound
        if( method !== 'on' && method != 'emit' && 'function' === typeof target[ method ] ) {
          target.on( method, target[ method ] );
        }

      });

      return this;

    }
  });

  Channel.properties( prototype, {
    event: undefined,
    once: function once( event, fn ) {
      // Channel.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1] );
      return this.many( event, 1, fn );
    },
    many: function( event, ttl, fn ) {
      // Channel.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1], typeof arguments[2] );

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
    emit: function emit() {
      // Channel.logger.debug( arguments.callee.name, arguments[0] );

      this._events || Channel.call( this );

      var type = arguments[0] && 'object' === typeof arguments[0] && Object.keys( arguments[0] ).length ? arguments[0].join( this._channel.delimiter ) : arguments[0];

      // Loop through the ** functions and invoke them.
      if( this._events[ '**' ].length ) {
        var l = arguments.length;
        var args = new Array( l - 1 );
        for( var i = 1; i < l; i++ ) {
          args[i - 1] = arguments[i];
        }
        for( i = 0, l = this._events[ '**' ].length; i < l; i++ ) {
          this.event = type;
          this._events[ '**' ][i].apply( this, args );
        }
      }

      // If there is no 'error' event listener then throw.
      if( type === 'error' && !this._events[ '**' ].length && !this._events.error ) {
        throw arguments[1] instanceof Error ? arguments[1] : new Error( "Uncaught, unspecified 'error' event." );
      }

      var handler = [];

      var ns = typeof type === 'string' ? type.split( this._channel.delimiter ) : type.slice();

      this.searchListenerTree( handler, ns, this._events, 0 );

      if( typeof handler === 'function' ) {
        //// Channel.logger.debug( '%s() handler %s IS a function', arguments.callee.name, type );
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
        //// Channel.logger.debug( '%s() handler %s is not a function', arguments.callee.name, type );
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
    on: function on( type, listener ) {
      // Channel.logger.debug( arguments.callee.name, arguments[0] )

      // If no type specified, assume we are creating an all-event listener
      if( typeof type === 'function' ) {
        listener = type;
        type = '**';
      }

      if( typeof listener !== 'function' ) {
        // Channel.logger.error( this.constructor.name, ':', arguments.callee.name, ' - callback must be typeof function, not', typeof listener, 'as provided.' )
        if( this.settings.throw ) { throw new Error( 'on only accepts instances of Function' ); } else { return this; }
      }

      this._events || Channel.call( this );

      // Break the "type" into array parts, and remove any blank values
      type = typeof type === 'string' ? type.split( this._channel.delimiter ).filter( function() { return arguments[0]; }) : type.slice();

      for( var i = 0, len = type.length; i + 1 < len; i++ ) {
        if( type[i] === '**' && type[i + 1] === '**' ) { return this; }
      }

      var tree = this._events;
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
                console.error( '(node) warning: possible Channel leak.', tree._listeners.length );
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
     * Add listener that will be triggered on any event
     *
     * @param fn
     * @return {*}
     */
    onAny: function onAny( fn ) {
      // Channel.logger.debug( arguments.callee.name, typeof arguments[0] )

      if( typeof fn !== 'function' ) {
        throw new Error( 'onAny only accepts instances of Function' );
      }

      // Add the function to the event listener collection.
      this._events[ '**' ].push( fn );

      return this;
    },
    off: function off( type, listener ) {
      // Channel.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1] )

      if( typeof listener !== 'function' ) {
        throw new Error( 'removeListener only takes instances of Function' );
      }

      var handlers, leafs = [];

      var ns = typeof type === 'string' ? type.split( this._channel.delimiter ) : type.slice();

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
    offAny: function offAny( fn ) {
      // Channel.logger.debug( arguments.callee.name, typeof arguments[0] )

      var i = 0, l = 0, fns;
      if( fn && this._events[ '**' ].length > 0 ) {
        fns = this._events[ '**' ];
        for( i = 0, l = fns.length; i < l; i++ ) {
          if( fn === fns[i] ) {
            fns.splice( i, 1 );
            return this;
          }
        }
      } else {
        this._events[ '**' ] = [];
      }
      return this;
    },
    removeAllListeners: function removeAllListeners( type ) {
      // Channel.logger.debug( arguments.callee.name, arguments[0] );

      if( arguments.length === 0 ) {
        !this._events || Channel.call( this );
        return this;
      }

      var ns = typeof type === 'string' ? type.split( this._channel.delimiter ) : type.slice();
      var leafs = this.searchListenerTree( null, ns, this._events, 0 );

      for( var iLeaf = 0; iLeaf < leafs.length; iLeaf++ ) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }

      return this;

    },
    listeners: function listeners( type ) {
      // Channel.logger.debug( arguments.callee.name, arguments[0] );

      var handlers = [];
      var ns = typeof type === 'string' ? type.split( this._channel.delimiter ) : type.slice();

      this.searchListenerTree( handlers, ns, this._events, 0 );

      return handlers;

    },
    /**
     * Wildcard Event Search
     *
     * @param handlers
     * @param type
     * @param tree
     * @param i
     * @return {Array}
     */
    searchListenerTree: function searchListenerTree( handlers, type, tree, i ) {
    // Channel.logger.debug( arguments.callee.name, handlers, type, typeof tree, i );

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

    if( ( currentType === '*' || currentType === '**' ) || tree[ currentType ] ) {

      if( currentType === '*' ) {
        for( branch in tree ) {
          if( branch !== '_listeners' && tree.hasOwnProperty( branch ) ) {
            listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i + 1 ) );
          }
        }
        return listeners;

      } else if( currentType === '**' ) {
        endReached = (i + 1 === typeLength || (i + 2 === typeLength && nextType === '*'));
        if( endReached && tree._listeners ) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat( this.searchListenerTree( handlers, type, tree, typeLength ) );
        }

        for( branch in tree ) {
          if( branch !== '_listeners' && tree.hasOwnProperty( branch ) ) {
            if( branch === '*' || branch === '**' ) {
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
              this.searchListenerTree( handlers, type, { '**': isolatedBranch }, i + 1 );
            }
          }
        }
      } else if( xxTree._listeners ) {
        // We have reached the end and still on a '**'
        this.searchListenerTree( handlers, type, xxTree, typeLength );
      } else if( xxTree['*'] && xxTree['*']._listeners ) {
        this.searchListenerTree( handlers, type, xxTree['*'], typeLength );
      }
    }

    return listeners;

    },
    subscribe: require( 'abstract' ).utility.noop,
    unsubscribe: require( 'abstract' ).utility.noop
  });

  // Instantiate Channel
  Channel.defineInstance( function createChannel( config ) {
    var Instance = this;

    Instance.listenerTree = {};
    Instance.wildcard = Channel.get( 'defaults.wildcard', true );
    Instance.maxListeners = Channel.get( 'defaults.maxListeners', 100 );
    Instance.delimiter = Channel.get( 'defaults.delimiter', '.' );

    //Instance.set( 'emitter', config );

    return this;

  });

});

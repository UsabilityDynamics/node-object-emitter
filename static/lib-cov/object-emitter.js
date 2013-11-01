// instrument by jscoverage, do not modifly this file
(function () {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (!BASE._$jscoverage) {
    BASE._$jscoverage = {};
    BASE._$jscoverage_cond = {};
    BASE._$jscoverage_done = function (file, line, express) {
      if (arguments.length === 2) {
        BASE._$jscoverage[file][line] ++;
      } else {
        BASE._$jscoverage_cond[file][line] ++;
        return express;
      }
    };
    BASE._$jscoverage_init = function (base, file, lines) {
      var tmp = [];
      for (var i = 0; i < lines.length; i ++) {
        tmp[lines[i]] = 0;
      }
      base[file] = tmp;
    };
  }
})();
_$jscoverage_init(_$jscoverage, "lib/object-emitter.js",[11,14,15,19,20,21,27,39,40,42,44,54,55,58,76,77,79,81,91,93,104,120,122,125,126,129,131,143,145,156,175,178,181,182,187,203,208,213,215,216,221,222,225,228,230,232,237,238,242,243,246,248,249,253,255,256,257,258,259,261,262,264,265,266,267,278,280,281,282,285,287,288,289,292,294,296,297,298,299,300,302,303,305,306,309,310,311,312,314,317,319,320,321,322,324,325,326,327,331,345,346,350,351,352,355,358,359,360,364,367,367,369,370,370,371,371,374,375,377,379,380,383,385,387,388,389,390,391,393,395,397,399,400,403,404,405,411,415,419,433,434,437,439,441,443,444,445,446,448,450,451,452,453,457,458,461,463,464,467,468,472,483,484,485,488,489,491,492,493,496,509,510,512,514,530,531,534,536,538,540,541,542,545,546,548,553,555,556,557,558,561,563,564,565,567,570,571,572,573,574,576,577,578,581,585,588,592,594,595,598,600,601,603,604,608,609,610,612,613,615,617,618,619,623,625,626,627,631,645,646,648,656,657,658,659,663]);
_$jscoverage_init(_$jscoverage_cond, "lib/object-emitter.js",[14,54,91,125,125,143,181,181,181,215,221,237,242,248,253,253,253,253,264,266,280,287,294,297,299,317,345,350,355,358,370,370,371,371,379,385,387,389,391,395,399,403,403,433,446,451,451,451,451,451,457,463,467,467,467,467,467,483,530,538,538,540,553,553,553,553,555,557,557,563,563,565,565,571,571,572,572,572,573,573,577,594,600,601,603,609,609,610,613,623,626,626,656,658,658]);
_$jscoverage["lib/object-emitter.js"].source = ["/**"," * Object Channels"," *"," * Create EventChannel channels."," *"," * @version 0.0.3"," * @module object-channel"," * @author potanin@UD"," * @constructor"," */","require( 'abstract' ).createModel( module.exports = function ObjectEmitter() {","","  // Construct Model only once.","  if( module.loaded ) {","    return ObjectEmitter;","  }","","  // Private Modules.","  var stream     = require( 'stream' );","  var domain     = require( 'domain' );","  var util       = require( 'util' );","","  /**","   * Instance Properties","   *","   */","  ObjectEmitter.defineProperties( ObjectEmitter, {","    inject: {","      /**","       * Force / Override properties","       *","       * If object not provided will bind to context.","       *","       * @param {Object} obj","       * @return {Object}","       */","      value: function inject( obj ) {","","        var target = obj || this;","        var Instance = new ObjectEmitter.create();","","        Object.getOwnPropertyNames( ObjectEmitter.prototype ).forEach( function( key ) {","","          Object.defineProperty( target, key, {","            value: Instance[ key ],","            enumerable: false,","            writable: true,","            configurable: true","          });","","        });","","        // Ensure we have an listener container.","        if( !target._events ) {","          target._events = {};","        }","","        return target;","","      },","      enumerable: true,","      configurable: true,","      writable: true","    },","    include: {","      /**","       * Include Instantiated ClusterEmitter","       *","       * If object not provided will bind to context.","       *","       * @param {Object} obj","       * @return {Object}","       */","      value: function include( obj ) {","","        var target = obj || this;","        var Instance = new ObjectEmitter.create();","","        for( var key in Instance ) {","","          Object.defineProperty( target, key, {","            value: target[ key ] || Instance[ key ],","            enumerable: false,","            writable: true,","            configurable: true","          });","","        }","","        // Ensure we have an listener container.","        if( !target._events ) {","","          Object.defineProperties( target, {","            _events: {","              value: {},","              enumerable: false,","              configurable: true,","              writable: true","            }","          });","","        }","","        return target;","","      },","      enumerable: true,","      configurable: true,","      writable: true","    },","    mixin: {","      /**","       * Mixin the Emitter properties.","       *","       * @param {Object} obj","       * @return {Object}","       */","      value: function mixin( obj ) {","","        for( var key in ObjectEmitter.prototype ) {","","          var descriptor = Object.getOwnPropertyDescriptor( obj, key );","","          // Detect if a property is not configurable.","          if( descriptor && !descriptor.configurable ) {","            break;","          }","","          try {","","            Object.defineProperty( obj, key, {","              value: obj[ key ] || ObjectEmitter.prototype[ key ],","              enumerable: false,","              writable: true,","              configurable: true","            });","","          } catch( error ) {}","","        }","","        // Ensure we have an listener container.","        if( !obj._events ) {","","          Object.defineProperties( obj, {","            _events: {","              value: {},","              enumerable: false,","              configurable: true,","              writable: true","            }","          });","","        }","","        return obj;","","      },","      enumerable: true,","      configurable: true,","      writable: true","    },","    eventify: {","      /**","       * Wrap Object's Methods into Events","       *","       * @param target","       * @param namespace","       * @param options","       * @returns {*}","       */","      value: function eventify( target, namespace, options ) {","","        // Enable EventChannel","        ObjectEmitter.extend( target, namespace, options );","","        // Trigger Method on Event","        Object.getOwnPropertyName( target ).forEach( function( method ) {","","          // @todo Should probably exclude all EE methods from being bound","          if( method !== 'on' && method != 'emit' && 'function' === typeof target[ method ] ) {","            target.on( method, target[ method ] );","          }","","        });","","        return this;","","      },","      enumerable: true,","      configurable: true,","      writable: true","    }","  });","","  /**","   * Constructor Properties","   *","   * The following properties are available within the constructor factory or by","   * referencing the constructor.","   *","   */","  ObjectEmitter.defineProperties( ObjectEmitter.prototype, {","","    // EventEmitter Methods","    once: function once( event, fn ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1] );","      return this.many( event, 1, fn );","    },","    many: function many( event, ttl, fn ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1], typeof arguments[2] );","","      var self = this;","","      if( typeof fn !== 'function' ) {","        throw new Error( 'many only accepts instances of Function' );","      }","","      function listener() {","","        if( --ttl === 0 ) {","          self.off( event, listener );","        }","","        fn.apply( this, arguments );","      };","","      listener._origin = fn;","","      this.on( event, listener );","","      return this;","    },","    emit: function emit() {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] );","","      if( !this._events ) {","        this._events = {};","      }","","      // If event storage is still not set, it must be uneditable.","      if( !this._events ) {","        return;","      }","","      var type = arguments[0] && 'object' === typeof arguments[0] && Object.keys( arguments[0] ).length ? arguments[0].join( this.get ? this.get( 'emitter.delimiter', '.' ) : '.' ) : arguments[0];","","      if( !this._events ) {","        this._events = {};","      }","","      // Loop through the ** functions and invoke them.","      if( ( this._events[ '#' ] && this._events[ '#' ].length )","        || ( this._events[ '**' ] && this._events[ '**' ].length ) ) {","        var l = arguments.length;","        var __length = this._events[ '#' ].length || this._events[ '**' ].length;","        var args = new Array( l - 1 );","        for( var i = 1; i < l; i++ ) {","          args[i - 1] = arguments[i];","        }","        for( i = 0, l = __length; i < l; i++ ) {","          this.event = type;","","          if( this._events[ '#' ] ) {","            this._events[ '#' ][i].apply( this, args );","          } else if ( this._events[ '**' ] ) {","            this._events[ '**' ][i].apply( this, args );","          }","","        }","      }","","      // If there is no 'error' event listener then throw.","      /* if( type === 'error' && !this._events[ '**' ].length && !this._events.error ) {","       throw arguments[1] instanceof Error ? arguments[1] : new Error( \"Uncaught, unspecified 'error' event.\" );","       } */","","      var handler = [];","","      if( 'undefined' === typeof type ) {","        console.error( 'type is undefined' );","        return this;","      }","","      var ns = typeof type === 'string' ? type.split( this.get ? this.get( 'emitter.delimiter', '.' ) : '.' ) : type.slice();","","      if( !this.searchListenerTree ) {","        console.error( 'Missing searchListenerTree()' );","        this.searchListenerTree = ObjectEmitter.prototype.searchListenerTree.bind( this );","      }","","      this.searchListenerTree( handler, ns, this._events, 0 );","","      if( typeof handler === 'function' ) {","        //// ObjectEmitter.logger.debug( '%s() handler %s IS a function', arguments.callee.name, type );","        this.event = type;","        if( arguments.length === 1 ) {","          handler.call( this );","        } else if( arguments.length > 1 ) {","          switch( arguments.length ) {","            case 2:","              handler.call( this, arguments[1] );","              break;","            case 3:","              handler.call( this, arguments[1], arguments[2] );","              break;","            // slower","            default:","              var l = arguments.length;","              var args = new Array( l - 1 );","              for( var i = 1; i < l; i++ ) {","                args[i - 1] = arguments[i];","              }","              handler.apply( this, args );","          }","        }","      } else if( handler ) {","        //// ObjectEmitter.logger.debug( '%s() handler %s is not a function', arguments.callee.name, type );","        var l = arguments.length;","        var args = new Array( l - 1 );","        for( var i = 1; i < l; i++ ) {","          args[i - 1] = arguments[i];","        }","        var listeners = handler.slice();","        for( var i = 0, l = listeners.length; i < l; i++ ) {","          this.event = type;","          listeners[i].apply( this, args );","        }","      }","","      return this;","","    },","","    /**","     * Add Listener","     *","     * @param type","     * @param listener","     * @returns {*}","     */","    on: function on( type, listener ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] )","","      if( type === '#' ) {","        type = '**';","      }","","      // If no type specified, assume we are creating an all-event listener","      if( typeof type === 'function' ) {","        listener = type;","        type = '#';","      }","","      if( typeof listener !== 'function' ) {","        // ObjectEmitter.logger.error( this.constructor.name, ':', arguments.callee.name, ' - callback must be typeof function, not', typeof listener, 'as provided.' )","","        if( this.settings.throw ) {","          throw new Error( 'on only accepts instances of Function' );","        } else { return this; }","","      }","","      this._events || ObjectEmitter.call( this );","","      // Break the \"type\" into array parts, and remove any blank values","      type = typeof type === 'string' ? type.split( this.get( 'emitter.delimiter', '.' ) ).filter( function() { return arguments[0]; }) : type.slice();","","      for( var i = 0, len = type.length; i + 1 < len; i++ ) {","        if( type[i] === '#' && type[i + 1] === '#' ) { return this; }","        if( type[i] === '**' && type[i + 1] === '**' ) { return this; }","      }","","      var tree = this._events = this._events || {};","      var name = type.shift();","","      while( name ) {","","        if( !tree[name] ) {","          tree[name] = {};","        }","","        tree = tree[name];","","        if( type.length === 0 ) {","","          if( !tree._listeners ) {","            tree._listeners = listener;","          } else if( typeof tree._listeners === 'function' ) {","            tree._listeners = [tree._listeners, listener];","          } else if( Array.isArray( tree._listeners ) ) {","","            tree._listeners.push( listener );","","            if( !tree._listeners.warned ) {","","              var m = this.maxListeners;","","              if( typeof this._events.maxListeners !== 'undefined' ) {","                m = this._events.maxListeners;","              }","","              if( m > 0 && tree._listeners.length > m ) {","                tree._listeners.warned = true;","                console.error( '(node) warning: possible emitter leak.', tree._listeners.length );","              }","","            }","          }","","          return this;","","        }","","        name = type.shift();","","      }","","      return this;","","    },","","    /**","     * Remove Listener","     *","     * @param type","     * @param listener","     * @returns {*}","     */","    off: function off( type, listener ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1] )","","      if( typeof listener !== 'function' ) {","        throw new Error( 'removeListener only takes instances of Function' );","      }","","      var handlers, leafs = [];","","      var ns = typeof type === 'string' ? type.split( this.get( 'emitter.delimiter', '.' ) ) : type.slice();","","      leafs = this.searchListenerTree( null, ns, this._events, 0 );","","      for( var iLeaf = 0; iLeaf < leafs.length; iLeaf++ ) {","        var leaf = leafs[iLeaf];","        handlers = leaf._listeners;","        if( Array.isArray( handlers ) ) {","","          var position = -1;","","          for( var i = 0, length = handlers.length; i < length; i++ ) {","            if( handlers[i] === listener || (handlers[i].listener && handlers[i].listener === listener) || (handlers[i]._origin && handlers[i]._origin === listener) ) {","              position = i;","              break;","            }","          }","","          if( position < 0 ) {","            return this;","          }","","          leaf._listeners.splice( position, 1 )","","          if( handlers.length === 0 ) {","            delete leaf._listeners;","          }","","        } else if( handlers === listener || (handlers.listener && handlers.listener === listener) || (handlers._origin && handlers._origin === listener) ) {","          delete leaf._listeners;","        }","      }","","      return this;","    },","","    /**","     * Remove All Listeners","     *","     * @param type","     * @returns {*}","     */","    removeAllListeners: function removeAllListeners( type ) {","","      if( arguments.length === 0 ) {","        !this._events || ObjectEmitter.call( this );","        return this;","      }","","      var ns = typeof type === 'string' ? type.split( this.get( 'emitter.delimiter', '.' ) ) : type.slice();","      var leafs = this.searchListenerTree( null, ns, this._events, 0 );","","      for( var iLeaf = 0; iLeaf < leafs.length; iLeaf++ ) {","        var leaf = leafs[iLeaf];","        leaf._listeners = null;","      }","","      return this;","","    },","","    /**","     * Get Listeners","     *","     * @param type","     * @returns {Array}","     */","    listeners: function listeners( type ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] );","","      var handlers = [];","      var ns = typeof type === 'string' ? type.split( this.get( 'emitter.delimiter', '.' ) ) : type.slice();","","      this.searchListenerTree( handlers, ns, this._events, 0 );","","      return handlers;","","    },","","    searchListenerTree: {","      /**","       * Search Listener Tree","       * @param handlers","       * @param type","       * @param tree","       * @param i","       * @returns {Array}","       */","      value: function searchListenerTree( handlers, type, tree, i ) {","        // ObjectEmitter.logger.debug( arguments.callee.name, handlers, type, typeof tree, i );","","        if( !tree ) {","          return [];","        }","","        var self = this;","","        var listeners = [], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached, typeLength = type.length, currentType = type[i], nextType = type[i + 1];","","        if( i === typeLength && tree._listeners ) {","","          if( typeof tree._listeners === 'function' ) {","            handlers && handlers.push( tree._listeners );","            return [tree];","","          } else {","            for( leaf = 0, len = tree._listeners.length; leaf < len; leaf++ ) {","              handlers && handlers.push( tree._listeners[leaf] );","            }","            return [tree];","          }","","        }","","        if( ( currentType === '*' || currentType === '**' || currentType === '#' ) || tree[ currentType ] ) {","","          if( currentType === '*' ) {","            for( branch in tree ) {","              if( branch !== '_listeners' && tree.hasOwnProperty( branch ) ) {","                listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i + 1 ) );","              }","            }","            return listeners;","","          } else if( currentType === '**' || currentType === '#' ) {","            endReached = (i + 1 === typeLength || (i + 2 === typeLength && nextType === '*'));","            if( endReached && tree._listeners ) {","              // The next element has a _listeners, add it to the handlers.","              listeners = listeners.concat( this.searchListenerTree( handlers, type, tree, typeLength ) );","            }","","            for( branch in tree ) {","              if( branch !== '_listeners' && tree.hasOwnProperty( branch ) ) {","                if( branch === '*' || ( branch === '**' || branch === '#' ) ) {","                  if( tree[branch]._listeners && !endReached ) {","                    listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], typeLength ) );","                  }","                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i ) );","                } else if( branch === nextType ) {","                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i + 2 ) );","                } else {","                  // No match on this one, shift into the tree but not in the type array.","                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i ) );","                }","              }","            }","            return listeners;","          }","","          listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[currentType], i + 1 ) );","","        }","","        xTree = tree['*'];","","        if( xTree ) {","          this.searchListenerTree( handlers, type, xTree, i + 1 );","        }","","        xxTree = tree[ '**' ];","","        if( xxTree ) {","          if( i < typeLength ) {","","            if( xxTree._listeners ) {","              this.searchListenerTree( handlers, type, xxTree, typeLength );","            }","","            // Build arrays of matching next branches and others.","            for( branch in xxTree ) {","              if( branch !== '_listeners' && xxTree.hasOwnProperty( branch ) ) {","                if( branch === nextType ) {","                  // We know the next element will match, so jump twice.","                  this.searchListenerTree( handlers, type, xxTree[branch], i + 2 );","                } else if( branch === currentType ) {","                  // Current node matches, move into the tree.","                  this.searchListenerTree( handlers, type, xxTree[branch], i + 1 );","                } else {","                  isolatedBranch = {};","                  isolatedBranch[branch] = xxTree[branch];","                  this.searchListenerTree( handlers, type, { '#': isolatedBranch }, i + 1 );","                }","              }","            }","          } else if( xxTree._listeners ) {","            // We have reached the end and still on a '#'","            this.searchListenerTree( handlers, type, xxTree, typeLength );","          } else if( xxTree['*'] && xxTree['*']._listeners ) {","            this.searchListenerTree( handlers, type, xxTree['*'], typeLength );","          }","        }","","        return listeners;","","      },","      writable: true,","      configurable: true,","      enumerable: true","    }","","  });","","  /**","   * Emitter Constructor.","   *","   */","  ObjectEmitter.defineConstructor( function create( options ) {","    var Instance = this;","","    Instance.properties({","      _events: {","        value: {},","        enumerable: false","      }","    });","","    // if there is an active domain, then attach to it.","    if( Instance.get( 'usingDomains' ) ) {","      domain = domain || require( 'domain' );","      if( domain.active && !( Instance instanceof domain.Domain )) {","        Instance.properties({ domain: { value: domain.active, enumerable: false }, });","      }","    }","","    return Instance;","","  });","","});",""];
_$jscoverage_done("lib/object-emitter.js", 11);
require("abstract").createModel(module.exports = function ObjectEmitter() {
    _$jscoverage_done("lib/object-emitter.js", 14);
    if (_$jscoverage_done("lib/object-emitter.js", 14, module.loaded)) {
        _$jscoverage_done("lib/object-emitter.js", 15);
        return ObjectEmitter;
    }
    _$jscoverage_done("lib/object-emitter.js", 19);
    var stream = require("stream");
    _$jscoverage_done("lib/object-emitter.js", 20);
    var domain = require("domain");
    _$jscoverage_done("lib/object-emitter.js", 21);
    var util = require("util");
    _$jscoverage_done("lib/object-emitter.js", 27);
    ObjectEmitter.defineProperties(ObjectEmitter, {
        inject: {
            value: function inject(obj) {
                _$jscoverage_done("lib/object-emitter.js", 39);
                var target = obj || this;
                _$jscoverage_done("lib/object-emitter.js", 40);
                var Instance = new ObjectEmitter.create;
                _$jscoverage_done("lib/object-emitter.js", 42);
                Object.getOwnPropertyNames(ObjectEmitter.prototype).forEach(function(key) {
                    _$jscoverage_done("lib/object-emitter.js", 44);
                    Object.defineProperty(target, key, {
                        value: Instance[key],
                        enumerable: false,
                        writable: true,
                        configurable: true
                    });
                });
                _$jscoverage_done("lib/object-emitter.js", 54);
                if (_$jscoverage_done("lib/object-emitter.js", 54, !target._events)) {
                    _$jscoverage_done("lib/object-emitter.js", 55);
                    target._events = {};
                }
                _$jscoverage_done("lib/object-emitter.js", 58);
                return target;
            },
            enumerable: true,
            configurable: true,
            writable: true
        },
        include: {
            value: function include(obj) {
                _$jscoverage_done("lib/object-emitter.js", 76);
                var target = obj || this;
                _$jscoverage_done("lib/object-emitter.js", 77);
                var Instance = new ObjectEmitter.create;
                _$jscoverage_done("lib/object-emitter.js", 79);
                for (var key in Instance) {
                    _$jscoverage_done("lib/object-emitter.js", 81);
                    Object.defineProperty(target, key, {
                        value: target[key] || Instance[key],
                        enumerable: false,
                        writable: true,
                        configurable: true
                    });
                }
                _$jscoverage_done("lib/object-emitter.js", 91);
                if (_$jscoverage_done("lib/object-emitter.js", 91, !target._events)) {
                    _$jscoverage_done("lib/object-emitter.js", 93);
                    Object.defineProperties(target, {
                        _events: {
                            value: {},
                            enumerable: false,
                            configurable: true,
                            writable: true
                        }
                    });
                }
                _$jscoverage_done("lib/object-emitter.js", 104);
                return target;
            },
            enumerable: true,
            configurable: true,
            writable: true
        },
        mixin: {
            value: function mixin(obj) {
                _$jscoverage_done("lib/object-emitter.js", 120);
                for (var key in ObjectEmitter.prototype) {
                    _$jscoverage_done("lib/object-emitter.js", 122);
                    var descriptor = Object.getOwnPropertyDescriptor(obj, key);
                    _$jscoverage_done("lib/object-emitter.js", 125);
                    if (_$jscoverage_done("lib/object-emitter.js", 125, descriptor) && _$jscoverage_done("lib/object-emitter.js", 125, !descriptor.configurable)) {
                        _$jscoverage_done("lib/object-emitter.js", 126);
                        break;
                    }
                    _$jscoverage_done("lib/object-emitter.js", 129);
                    try {
                        _$jscoverage_done("lib/object-emitter.js", 131);
                        Object.defineProperty(obj, key, {
                            value: obj[key] || ObjectEmitter.prototype[key],
                            enumerable: false,
                            writable: true,
                            configurable: true
                        });
                    } catch (error) {}
                }
                _$jscoverage_done("lib/object-emitter.js", 143);
                if (_$jscoverage_done("lib/object-emitter.js", 143, !obj._events)) {
                    _$jscoverage_done("lib/object-emitter.js", 145);
                    Object.defineProperties(obj, {
                        _events: {
                            value: {},
                            enumerable: false,
                            configurable: true,
                            writable: true
                        }
                    });
                }
                _$jscoverage_done("lib/object-emitter.js", 156);
                return obj;
            },
            enumerable: true,
            configurable: true,
            writable: true
        },
        eventify: {
            value: function eventify(target, namespace, options) {
                _$jscoverage_done("lib/object-emitter.js", 175);
                ObjectEmitter.extend(target, namespace, options);
                _$jscoverage_done("lib/object-emitter.js", 178);
                Object.getOwnPropertyName(target).forEach(function(method) {
                    _$jscoverage_done("lib/object-emitter.js", 181);
                    if (_$jscoverage_done("lib/object-emitter.js", 181, method !== "on") && _$jscoverage_done("lib/object-emitter.js", 181, method != "emit") && _$jscoverage_done("lib/object-emitter.js", 181, "function" === typeof target[method])) {
                        _$jscoverage_done("lib/object-emitter.js", 182);
                        target.on(method, target[method]);
                    }
                });
                _$jscoverage_done("lib/object-emitter.js", 187);
                return this;
            },
            enumerable: true,
            configurable: true,
            writable: true
        }
    });
    _$jscoverage_done("lib/object-emitter.js", 203);
    ObjectEmitter.defineProperties(ObjectEmitter.prototype, {
        once: function once(event, fn) {
            _$jscoverage_done("lib/object-emitter.js", 208);
            return this.many(event, 1, fn);
        },
        many: function many(event, ttl, fn) {
            _$jscoverage_done("lib/object-emitter.js", 213);
            var self = this;
            _$jscoverage_done("lib/object-emitter.js", 215);
            if (_$jscoverage_done("lib/object-emitter.js", 215, typeof fn !== "function")) {
                _$jscoverage_done("lib/object-emitter.js", 216);
                throw new Error("many only accepts instances of Function");
            }
            function listener() {
                _$jscoverage_done("lib/object-emitter.js", 221);
                if (_$jscoverage_done("lib/object-emitter.js", 221, --ttl === 0)) {
                    _$jscoverage_done("lib/object-emitter.js", 222);
                    self.off(event, listener);
                }
                _$jscoverage_done("lib/object-emitter.js", 225);
                fn.apply(this, arguments);
            }
            _$jscoverage_done("lib/object-emitter.js", 228);
            listener._origin = fn;
            _$jscoverage_done("lib/object-emitter.js", 230);
            this.on(event, listener);
            _$jscoverage_done("lib/object-emitter.js", 232);
            return this;
        },
        emit: function emit() {
            _$jscoverage_done("lib/object-emitter.js", 237);
            if (_$jscoverage_done("lib/object-emitter.js", 237, !this._events)) {
                _$jscoverage_done("lib/object-emitter.js", 238);
                this._events = {};
            }
            _$jscoverage_done("lib/object-emitter.js", 242);
            if (_$jscoverage_done("lib/object-emitter.js", 242, !this._events)) {
                _$jscoverage_done("lib/object-emitter.js", 243);
                return;
            }
            _$jscoverage_done("lib/object-emitter.js", 246);
            var type = arguments[0] && "object" === typeof arguments[0] && Object.keys(arguments[0]).length ? arguments[0].join(this.get ? this.get("emitter.delimiter", ".") : ".") : arguments[0];
            _$jscoverage_done("lib/object-emitter.js", 248);
            if (_$jscoverage_done("lib/object-emitter.js", 248, !this._events)) {
                _$jscoverage_done("lib/object-emitter.js", 249);
                this._events = {};
            }
            _$jscoverage_done("lib/object-emitter.js", 253);
            if (_$jscoverage_done("lib/object-emitter.js", 253, this._events["#"]) && _$jscoverage_done("lib/object-emitter.js", 253, this._events["#"].length) || _$jscoverage_done("lib/object-emitter.js", 253, this._events["**"]) && _$jscoverage_done("lib/object-emitter.js", 253, this._events["**"].length)) {
                _$jscoverage_done("lib/object-emitter.js", 255);
                var l = arguments.length;
                _$jscoverage_done("lib/object-emitter.js", 256);
                var __length = this._events["#"].length || this._events["**"].length;
                _$jscoverage_done("lib/object-emitter.js", 257);
                var args = new Array(l - 1);
                _$jscoverage_done("lib/object-emitter.js", 258);
                for (var i = 1; i < l; i++) {
                    _$jscoverage_done("lib/object-emitter.js", 259);
                    args[i - 1] = arguments[i];
                }
                _$jscoverage_done("lib/object-emitter.js", 261);
                for (i = 0, l = __length; i < l; i++) {
                    _$jscoverage_done("lib/object-emitter.js", 262);
                    this.event = type;
                    _$jscoverage_done("lib/object-emitter.js", 264);
                    if (_$jscoverage_done("lib/object-emitter.js", 264, this._events["#"])) {
                        _$jscoverage_done("lib/object-emitter.js", 265);
                        this._events["#"][i].apply(this, args);
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 266);
                        if (_$jscoverage_done("lib/object-emitter.js", 266, this._events["**"])) {
                            _$jscoverage_done("lib/object-emitter.js", 267);
                            this._events["**"][i].apply(this, args);
                        }
                    }
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 278);
            var handler = [];
            _$jscoverage_done("lib/object-emitter.js", 280);
            if (_$jscoverage_done("lib/object-emitter.js", 280, "undefined" === typeof type)) {
                _$jscoverage_done("lib/object-emitter.js", 281);
                console.error("type is undefined");
                _$jscoverage_done("lib/object-emitter.js", 282);
                return this;
            }
            _$jscoverage_done("lib/object-emitter.js", 285);
            var ns = typeof type === "string" ? type.split(this.get ? this.get("emitter.delimiter", ".") : ".") : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 287);
            if (_$jscoverage_done("lib/object-emitter.js", 287, !this.searchListenerTree)) {
                _$jscoverage_done("lib/object-emitter.js", 288);
                console.error("Missing searchListenerTree()");
                _$jscoverage_done("lib/object-emitter.js", 289);
                this.searchListenerTree = ObjectEmitter.prototype.searchListenerTree.bind(this);
            }
            _$jscoverage_done("lib/object-emitter.js", 292);
            this.searchListenerTree(handler, ns, this._events, 0);
            _$jscoverage_done("lib/object-emitter.js", 294);
            if (_$jscoverage_done("lib/object-emitter.js", 294, typeof handler === "function")) {
                _$jscoverage_done("lib/object-emitter.js", 296);
                this.event = type;
                _$jscoverage_done("lib/object-emitter.js", 297);
                if (_$jscoverage_done("lib/object-emitter.js", 297, arguments.length === 1)) {
                    _$jscoverage_done("lib/object-emitter.js", 298);
                    handler.call(this);
                } else {
                    _$jscoverage_done("lib/object-emitter.js", 299);
                    if (_$jscoverage_done("lib/object-emitter.js", 299, arguments.length > 1)) {
                        _$jscoverage_done("lib/object-emitter.js", 300);
                        switch (arguments.length) {
                          case 2:
                            _$jscoverage_done("lib/object-emitter.js", 302);
                            handler.call(this, arguments[1]);
                            _$jscoverage_done("lib/object-emitter.js", 303);
                            break;
                          case 3:
                            _$jscoverage_done("lib/object-emitter.js", 305);
                            handler.call(this, arguments[1], arguments[2]);
                            _$jscoverage_done("lib/object-emitter.js", 306);
                            break;
                          default:
                            _$jscoverage_done("lib/object-emitter.js", 309);
                            var l = arguments.length;
                            _$jscoverage_done("lib/object-emitter.js", 310);
                            var args = new Array(l - 1);
                            _$jscoverage_done("lib/object-emitter.js", 311);
                            for (var i = 1; i < l; i++) {
                                _$jscoverage_done("lib/object-emitter.js", 312);
                                args[i - 1] = arguments[i];
                            }
                            _$jscoverage_done("lib/object-emitter.js", 314);
                            handler.apply(this, args);
                        }
                    }
                }
            } else {
                _$jscoverage_done("lib/object-emitter.js", 317);
                if (_$jscoverage_done("lib/object-emitter.js", 317, handler)) {
                    _$jscoverage_done("lib/object-emitter.js", 319);
                    var l = arguments.length;
                    _$jscoverage_done("lib/object-emitter.js", 320);
                    var args = new Array(l - 1);
                    _$jscoverage_done("lib/object-emitter.js", 321);
                    for (var i = 1; i < l; i++) {
                        _$jscoverage_done("lib/object-emitter.js", 322);
                        args[i - 1] = arguments[i];
                    }
                    _$jscoverage_done("lib/object-emitter.js", 324);
                    var listeners = handler.slice();
                    _$jscoverage_done("lib/object-emitter.js", 325);
                    for (var i = 0, l = listeners.length; i < l; i++) {
                        _$jscoverage_done("lib/object-emitter.js", 326);
                        this.event = type;
                        _$jscoverage_done("lib/object-emitter.js", 327);
                        listeners[i].apply(this, args);
                    }
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 331);
            return this;
        },
        on: function on(type, listener) {
            _$jscoverage_done("lib/object-emitter.js", 345);
            if (_$jscoverage_done("lib/object-emitter.js", 345, type === "#")) {
                _$jscoverage_done("lib/object-emitter.js", 346);
                type = "**";
            }
            _$jscoverage_done("lib/object-emitter.js", 350);
            if (_$jscoverage_done("lib/object-emitter.js", 350, typeof type === "function")) {
                _$jscoverage_done("lib/object-emitter.js", 351);
                listener = type;
                _$jscoverage_done("lib/object-emitter.js", 352);
                type = "#";
            }
            _$jscoverage_done("lib/object-emitter.js", 355);
            if (_$jscoverage_done("lib/object-emitter.js", 355, typeof listener !== "function")) {
                _$jscoverage_done("lib/object-emitter.js", 358);
                if (_$jscoverage_done("lib/object-emitter.js", 358, this.settings.throw)) {
                    _$jscoverage_done("lib/object-emitter.js", 359);
                    throw new Error("on only accepts instances of Function");
                } else {
                    _$jscoverage_done("lib/object-emitter.js", 360);
                    return this;
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 364);
            this._events || ObjectEmitter.call(this);
            _$jscoverage_done("lib/object-emitter.js", 367);
            type = typeof type === "string" ? type.split(this.get("emitter.delimiter", ".")).filter(function() {
                _$jscoverage_done("lib/object-emitter.js", 367);
                return arguments[0];
            }) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 369);
            for (var i = 0, len = type.length; i + 1 < len; i++) {
                _$jscoverage_done("lib/object-emitter.js", 370);
                if (_$jscoverage_done("lib/object-emitter.js", 370, type[i] === "#") && _$jscoverage_done("lib/object-emitter.js", 370, type[i + 1] === "#")) {
                    _$jscoverage_done("lib/object-emitter.js", 370);
                    return this;
                }
                _$jscoverage_done("lib/object-emitter.js", 371);
                if (_$jscoverage_done("lib/object-emitter.js", 371, type[i] === "**") && _$jscoverage_done("lib/object-emitter.js", 371, type[i + 1] === "**")) {
                    _$jscoverage_done("lib/object-emitter.js", 371);
                    return this;
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 374);
            var tree = this._events = this._events || {};
            _$jscoverage_done("lib/object-emitter.js", 375);
            var name = type.shift();
            _$jscoverage_done("lib/object-emitter.js", 377);
            while (name) {
                _$jscoverage_done("lib/object-emitter.js", 379);
                if (_$jscoverage_done("lib/object-emitter.js", 379, !tree[name])) {
                    _$jscoverage_done("lib/object-emitter.js", 380);
                    tree[name] = {};
                }
                _$jscoverage_done("lib/object-emitter.js", 383);
                tree = tree[name];
                _$jscoverage_done("lib/object-emitter.js", 385);
                if (_$jscoverage_done("lib/object-emitter.js", 385, type.length === 0)) {
                    _$jscoverage_done("lib/object-emitter.js", 387);
                    if (_$jscoverage_done("lib/object-emitter.js", 387, !tree._listeners)) {
                        _$jscoverage_done("lib/object-emitter.js", 388);
                        tree._listeners = listener;
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 389);
                        if (_$jscoverage_done("lib/object-emitter.js", 389, typeof tree._listeners === "function")) {
                            _$jscoverage_done("lib/object-emitter.js", 390);
                            tree._listeners = [ tree._listeners, listener ];
                        } else {
                            _$jscoverage_done("lib/object-emitter.js", 391);
                            if (_$jscoverage_done("lib/object-emitter.js", 391, Array.isArray(tree._listeners))) {
                                _$jscoverage_done("lib/object-emitter.js", 393);
                                tree._listeners.push(listener);
                                _$jscoverage_done("lib/object-emitter.js", 395);
                                if (_$jscoverage_done("lib/object-emitter.js", 395, !tree._listeners.warned)) {
                                    _$jscoverage_done("lib/object-emitter.js", 397);
                                    var m = this.maxListeners;
                                    _$jscoverage_done("lib/object-emitter.js", 399);
                                    if (_$jscoverage_done("lib/object-emitter.js", 399, typeof this._events.maxListeners !== "undefined")) {
                                        _$jscoverage_done("lib/object-emitter.js", 400);
                                        m = this._events.maxListeners;
                                    }
                                    _$jscoverage_done("lib/object-emitter.js", 403);
                                    if (_$jscoverage_done("lib/object-emitter.js", 403, m > 0) && _$jscoverage_done("lib/object-emitter.js", 403, tree._listeners.length > m)) {
                                        _$jscoverage_done("lib/object-emitter.js", 404);
                                        tree._listeners.warned = true;
                                        _$jscoverage_done("lib/object-emitter.js", 405);
                                        console.error("(node) warning: possible emitter leak.", tree._listeners.length);
                                    }
                                }
                            }
                        }
                    }
                    _$jscoverage_done("lib/object-emitter.js", 411);
                    return this;
                }
                _$jscoverage_done("lib/object-emitter.js", 415);
                name = type.shift();
            }
            _$jscoverage_done("lib/object-emitter.js", 419);
            return this;
        },
        off: function off(type, listener) {
            _$jscoverage_done("lib/object-emitter.js", 433);
            if (_$jscoverage_done("lib/object-emitter.js", 433, typeof listener !== "function")) {
                _$jscoverage_done("lib/object-emitter.js", 434);
                throw new Error("removeListener only takes instances of Function");
            }
            _$jscoverage_done("lib/object-emitter.js", 437);
            var handlers, leafs = [];
            _$jscoverage_done("lib/object-emitter.js", 439);
            var ns = typeof type === "string" ? type.split(this.get("emitter.delimiter", ".")) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 441);
            leafs = this.searchListenerTree(null, ns, this._events, 0);
            _$jscoverage_done("lib/object-emitter.js", 443);
            for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
                _$jscoverage_done("lib/object-emitter.js", 444);
                var leaf = leafs[iLeaf];
                _$jscoverage_done("lib/object-emitter.js", 445);
                handlers = leaf._listeners;
                _$jscoverage_done("lib/object-emitter.js", 446);
                if (_$jscoverage_done("lib/object-emitter.js", 446, Array.isArray(handlers))) {
                    _$jscoverage_done("lib/object-emitter.js", 448);
                    var position = -1;
                    _$jscoverage_done("lib/object-emitter.js", 450);
                    for (var i = 0, length = handlers.length; i < length; i++) {
                        _$jscoverage_done("lib/object-emitter.js", 451);
                        if (_$jscoverage_done("lib/object-emitter.js", 451, handlers[i] === listener) || _$jscoverage_done("lib/object-emitter.js", 451, handlers[i].listener) && _$jscoverage_done("lib/object-emitter.js", 451, handlers[i].listener === listener) || _$jscoverage_done("lib/object-emitter.js", 451, handlers[i]._origin) && _$jscoverage_done("lib/object-emitter.js", 451, handlers[i]._origin === listener)) {
                            _$jscoverage_done("lib/object-emitter.js", 452);
                            position = i;
                            _$jscoverage_done("lib/object-emitter.js", 453);
                            break;
                        }
                    }
                    _$jscoverage_done("lib/object-emitter.js", 457);
                    if (_$jscoverage_done("lib/object-emitter.js", 457, position < 0)) {
                        _$jscoverage_done("lib/object-emitter.js", 458);
                        return this;
                    }
                    _$jscoverage_done("lib/object-emitter.js", 461);
                    leaf._listeners.splice(position, 1);
                    _$jscoverage_done("lib/object-emitter.js", 463);
                    if (_$jscoverage_done("lib/object-emitter.js", 463, handlers.length === 0)) {
                        _$jscoverage_done("lib/object-emitter.js", 464);
                        delete leaf._listeners;
                    }
                } else {
                    _$jscoverage_done("lib/object-emitter.js", 467);
                    if (_$jscoverage_done("lib/object-emitter.js", 467, handlers === listener) || _$jscoverage_done("lib/object-emitter.js", 467, handlers.listener) && _$jscoverage_done("lib/object-emitter.js", 467, handlers.listener === listener) || _$jscoverage_done("lib/object-emitter.js", 467, handlers._origin) && _$jscoverage_done("lib/object-emitter.js", 467, handlers._origin === listener)) {
                        _$jscoverage_done("lib/object-emitter.js", 468);
                        delete leaf._listeners;
                    }
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 472);
            return this;
        },
        removeAllListeners: function removeAllListeners(type) {
            _$jscoverage_done("lib/object-emitter.js", 483);
            if (_$jscoverage_done("lib/object-emitter.js", 483, arguments.length === 0)) {
                _$jscoverage_done("lib/object-emitter.js", 484);
                !this._events || ObjectEmitter.call(this);
                _$jscoverage_done("lib/object-emitter.js", 485);
                return this;
            }
            _$jscoverage_done("lib/object-emitter.js", 488);
            var ns = typeof type === "string" ? type.split(this.get("emitter.delimiter", ".")) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 489);
            var leafs = this.searchListenerTree(null, ns, this._events, 0);
            _$jscoverage_done("lib/object-emitter.js", 491);
            for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
                _$jscoverage_done("lib/object-emitter.js", 492);
                var leaf = leafs[iLeaf];
                _$jscoverage_done("lib/object-emitter.js", 493);
                leaf._listeners = null;
            }
            _$jscoverage_done("lib/object-emitter.js", 496);
            return this;
        },
        listeners: function listeners(type) {
            _$jscoverage_done("lib/object-emitter.js", 509);
            var handlers = [];
            _$jscoverage_done("lib/object-emitter.js", 510);
            var ns = typeof type === "string" ? type.split(this.get("emitter.delimiter", ".")) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 512);
            this.searchListenerTree(handlers, ns, this._events, 0);
            _$jscoverage_done("lib/object-emitter.js", 514);
            return handlers;
        },
        searchListenerTree: {
            value: function searchListenerTree(handlers, type, tree, i) {
                _$jscoverage_done("lib/object-emitter.js", 530);
                if (_$jscoverage_done("lib/object-emitter.js", 530, !tree)) {
                    _$jscoverage_done("lib/object-emitter.js", 531);
                    return [];
                }
                _$jscoverage_done("lib/object-emitter.js", 534);
                var self = this;
                _$jscoverage_done("lib/object-emitter.js", 536);
                var listeners = [], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached, typeLength = type.length, currentType = type[i], nextType = type[i + 1];
                _$jscoverage_done("lib/object-emitter.js", 538);
                if (_$jscoverage_done("lib/object-emitter.js", 538, i === typeLength) && _$jscoverage_done("lib/object-emitter.js", 538, tree._listeners)) {
                    _$jscoverage_done("lib/object-emitter.js", 540);
                    if (_$jscoverage_done("lib/object-emitter.js", 540, typeof tree._listeners === "function")) {
                        _$jscoverage_done("lib/object-emitter.js", 541);
                        handlers && handlers.push(tree._listeners);
                        _$jscoverage_done("lib/object-emitter.js", 542);
                        return [ tree ];
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 545);
                        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
                            _$jscoverage_done("lib/object-emitter.js", 546);
                            handlers && handlers.push(tree._listeners[leaf]);
                        }
                        _$jscoverage_done("lib/object-emitter.js", 548);
                        return [ tree ];
                    }
                }
                _$jscoverage_done("lib/object-emitter.js", 553);
                if (_$jscoverage_done("lib/object-emitter.js", 553, currentType === "*") || _$jscoverage_done("lib/object-emitter.js", 553, currentType === "**") || _$jscoverage_done("lib/object-emitter.js", 553, currentType === "#") || _$jscoverage_done("lib/object-emitter.js", 553, tree[currentType])) {
                    _$jscoverage_done("lib/object-emitter.js", 555);
                    if (_$jscoverage_done("lib/object-emitter.js", 555, currentType === "*")) {
                        _$jscoverage_done("lib/object-emitter.js", 556);
                        for (branch in tree) {
                            _$jscoverage_done("lib/object-emitter.js", 557);
                            if (_$jscoverage_done("lib/object-emitter.js", 557, branch !== "_listeners") && _$jscoverage_done("lib/object-emitter.js", 557, tree.hasOwnProperty(branch))) {
                                _$jscoverage_done("lib/object-emitter.js", 558);
                                listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], i + 1));
                            }
                        }
                        _$jscoverage_done("lib/object-emitter.js", 561);
                        return listeners;
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 563);
                        if (_$jscoverage_done("lib/object-emitter.js", 563, currentType === "**") || _$jscoverage_done("lib/object-emitter.js", 563, currentType === "#")) {
                            _$jscoverage_done("lib/object-emitter.js", 564);
                            endReached = i + 1 === typeLength || i + 2 === typeLength && nextType === "*";
                            _$jscoverage_done("lib/object-emitter.js", 565);
                            if (_$jscoverage_done("lib/object-emitter.js", 565, endReached) && _$jscoverage_done("lib/object-emitter.js", 565, tree._listeners)) {
                                _$jscoverage_done("lib/object-emitter.js", 567);
                                listeners = listeners.concat(this.searchListenerTree(handlers, type, tree, typeLength));
                            }
                            _$jscoverage_done("lib/object-emitter.js", 570);
                            for (branch in tree) {
                                _$jscoverage_done("lib/object-emitter.js", 571);
                                if (_$jscoverage_done("lib/object-emitter.js", 571, branch !== "_listeners") && _$jscoverage_done("lib/object-emitter.js", 571, tree.hasOwnProperty(branch))) {
                                    _$jscoverage_done("lib/object-emitter.js", 572);
                                    if (_$jscoverage_done("lib/object-emitter.js", 572, branch === "*") || _$jscoverage_done("lib/object-emitter.js", 572, branch === "**") || _$jscoverage_done("lib/object-emitter.js", 572, branch === "#")) {
                                        _$jscoverage_done("lib/object-emitter.js", 573);
                                        if (_$jscoverage_done("lib/object-emitter.js", 573, tree[branch]._listeners) && _$jscoverage_done("lib/object-emitter.js", 573, !endReached)) {
                                            _$jscoverage_done("lib/object-emitter.js", 574);
                                            listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], typeLength));
                                        }
                                        _$jscoverage_done("lib/object-emitter.js", 576);
                                        listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], i));
                                    } else {
                                        _$jscoverage_done("lib/object-emitter.js", 577);
                                        if (_$jscoverage_done("lib/object-emitter.js", 577, branch === nextType)) {
                                            _$jscoverage_done("lib/object-emitter.js", 578);
                                            listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], i + 2));
                                        } else {
                                            _$jscoverage_done("lib/object-emitter.js", 581);
                                            listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], i));
                                        }
                                    }
                                }
                            }
                            _$jscoverage_done("lib/object-emitter.js", 585);
                            return listeners;
                        }
                    }
                    _$jscoverage_done("lib/object-emitter.js", 588);
                    listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[currentType], i + 1));
                }
                _$jscoverage_done("lib/object-emitter.js", 592);
                xTree = tree["*"];
                _$jscoverage_done("lib/object-emitter.js", 594);
                if (_$jscoverage_done("lib/object-emitter.js", 594, xTree)) {
                    _$jscoverage_done("lib/object-emitter.js", 595);
                    this.searchListenerTree(handlers, type, xTree, i + 1);
                }
                _$jscoverage_done("lib/object-emitter.js", 598);
                xxTree = tree["**"];
                _$jscoverage_done("lib/object-emitter.js", 600);
                if (_$jscoverage_done("lib/object-emitter.js", 600, xxTree)) {
                    _$jscoverage_done("lib/object-emitter.js", 601);
                    if (_$jscoverage_done("lib/object-emitter.js", 601, i < typeLength)) {
                        _$jscoverage_done("lib/object-emitter.js", 603);
                        if (_$jscoverage_done("lib/object-emitter.js", 603, xxTree._listeners)) {
                            _$jscoverage_done("lib/object-emitter.js", 604);
                            this.searchListenerTree(handlers, type, xxTree, typeLength);
                        }
                        _$jscoverage_done("lib/object-emitter.js", 608);
                        for (branch in xxTree) {
                            _$jscoverage_done("lib/object-emitter.js", 609);
                            if (_$jscoverage_done("lib/object-emitter.js", 609, branch !== "_listeners") && _$jscoverage_done("lib/object-emitter.js", 609, xxTree.hasOwnProperty(branch))) {
                                _$jscoverage_done("lib/object-emitter.js", 610);
                                if (_$jscoverage_done("lib/object-emitter.js", 610, branch === nextType)) {
                                    _$jscoverage_done("lib/object-emitter.js", 612);
                                    this.searchListenerTree(handlers, type, xxTree[branch], i + 2);
                                } else {
                                    _$jscoverage_done("lib/object-emitter.js", 613);
                                    if (_$jscoverage_done("lib/object-emitter.js", 613, branch === currentType)) {
                                        _$jscoverage_done("lib/object-emitter.js", 615);
                                        this.searchListenerTree(handlers, type, xxTree[branch], i + 1);
                                    } else {
                                        _$jscoverage_done("lib/object-emitter.js", 617);
                                        isolatedBranch = {};
                                        _$jscoverage_done("lib/object-emitter.js", 618);
                                        isolatedBranch[branch] = xxTree[branch];
                                        _$jscoverage_done("lib/object-emitter.js", 619);
                                        this.searchListenerTree(handlers, type, {
                                            "#": isolatedBranch
                                        }, i + 1);
                                    }
                                }
                            }
                        }
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 623);
                        if (_$jscoverage_done("lib/object-emitter.js", 623, xxTree._listeners)) {
                            _$jscoverage_done("lib/object-emitter.js", 625);
                            this.searchListenerTree(handlers, type, xxTree, typeLength);
                        } else {
                            _$jscoverage_done("lib/object-emitter.js", 626);
                            if (_$jscoverage_done("lib/object-emitter.js", 626, xxTree["*"]) && _$jscoverage_done("lib/object-emitter.js", 626, xxTree["*"]._listeners)) {
                                _$jscoverage_done("lib/object-emitter.js", 627);
                                this.searchListenerTree(handlers, type, xxTree["*"], typeLength);
                            }
                        }
                    }
                }
                _$jscoverage_done("lib/object-emitter.js", 631);
                return listeners;
            },
            writable: true,
            configurable: true,
            enumerable: true
        }
    });
    _$jscoverage_done("lib/object-emitter.js", 645);
    ObjectEmitter.defineConstructor(function create(options) {
        _$jscoverage_done("lib/object-emitter.js", 646);
        var Instance = this;
        _$jscoverage_done("lib/object-emitter.js", 648);
        Instance.properties({
            _events: {
                value: {},
                enumerable: false
            }
        });
        _$jscoverage_done("lib/object-emitter.js", 656);
        if (_$jscoverage_done("lib/object-emitter.js", 656, Instance.get("usingDomains"))) {
            _$jscoverage_done("lib/object-emitter.js", 657);
            domain = domain || require("domain");
            _$jscoverage_done("lib/object-emitter.js", 658);
            if (_$jscoverage_done("lib/object-emitter.js", 658, domain.active) && _$jscoverage_done("lib/object-emitter.js", 658, !(Instance instanceof domain.Domain))) {
                _$jscoverage_done("lib/object-emitter.js", 659);
                Instance.properties({
                    domain: {
                        value: domain.active,
                        enumerable: false
                    }
                });
            }
        }
        _$jscoverage_done("lib/object-emitter.js", 663);
        return Instance;
    });
});
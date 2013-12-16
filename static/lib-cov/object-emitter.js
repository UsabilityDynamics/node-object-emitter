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
_$jscoverage_init(_$jscoverage, "lib/object-emitter.js",[11,14,15,19,20,26,40,41,43,45,47,58,66,68,69,72,74,75,82,100,101,103,105,115,117,126,142,144,147,148,151,153,165,167,176,195,198,201,202,207,223,233,246,248,249,254,255,258,261,263,265,275,277,278,281,283,293,294,297,299,301,311,313,314,315,316,317,319,320,322,323,324,325,336,338,339,340,343,345,346,347,350,352,354,355,356,357,358,360,361,363,364,367,368,369,370,372,375,377,378,379,380,382,383,384,385,389,403,405,406,409,410,414,415,416,419,422,423,424,428,433,433,435,436,436,437,437,440,442,444,446,447,450,452,454,455,456,457,458,460,462,464,466,467,470,471,472,478,482,486,500,502,503,506,507,510,512,514,516,517,518,519,521,523,524,525,526,530,531,534,536,537,540,541,545,555,557,558,561,562,563,566,567,569,570,571,574,587,589,590,593,594,596,598,614,615,618,620,622,624,625,626,629,630,632,637,639,640,641,642,645,647,648,649,651,654,655,656,657,658,660,661,662,665,669,672,676,678,679,682,684,685,687,688,692,693,694,696,697,699,701,702,703,707,709,710,711,715,729,730,732,740,741,742,744,754]);
_$jscoverage_init(_$jscoverage_cond, "lib/object-emitter.js",[14,68,72,115,147,147,165,201,201,201,248,254,277,277,281,293,299,311,311,311,311,322,324,338,345,352,355,357,375,405,405,409,414,419,422,436,436,437,437,446,452,454,456,458,462,466,470,470,502,502,506,519,524,524,524,524,524,530,536,540,540,540,540,540,557,557,561,589,589,614,622,622,624,637,637,637,637,639,641,641,647,647,649,649,655,655,656,656,656,657,657,661,678,684,685,687,693,693,694,697,707,710,710,740,740,740,742,742]);
_$jscoverage["lib/object-emitter.js"].source = ["/**"," * Object Channels"," *"," * Create EventChannel channels."," *"," * @version 0.1.0"," * @module object-channel"," * @author potanin@UD"," * @constructor"," */","require( 'abstract' ).createModel( module.exports = function ObjectEmitter() {","","  // Construct Model only once.","  if( module.loaded ) {","    return ObjectEmitter;","  }","","  // Private Modules.","  var domain     = require( 'domain' );","  var util       = require( 'util' );","","  /**","   * Instance Properties","   *","   */","  ObjectEmitter.defineProperties( ObjectEmitter, {","    inject: {","      /**","       * Force / Override properties","       *","       * If object not provided will bind to context.","       *","       * @todo Migrate structure conversion logic into seperate method.","       *","       * @param {Object} obj","       * @return {Object}","       */","      value: function inject( obj ) {","","        var Instance = new ObjectEmitter.create();","        var _events = obj._events || {};","","        Object.getOwnPropertyNames( ObjectEmitter.prototype ).forEach( function( key ) {","","          var descriptor = Object.getOwnPropertyDescriptor( obj, key );","","          Object.defineProperty( obj, key, {","            value: Instance[ key ],","            enumerable: descriptor ? descriptor.enumerable : false,","            writable: true,","            configurable: true","          });","","        });","","        // Ensure we have an listener container.","","        Object.defineProperty( obj, '_events', {","          value: _events,","          enumerable: false,","          configurable: true,","          writable: true","        });","","        // Convert Structure from standard to nested.","        for( var _tag in _events ) {","","          if( 'function' === typeof _events[ _tag ] ) {","            obj.on( _tag, _events[ _tag ] );","          }","","          if( Object.prototype.toString.call( _events[ _tag ] ) === '[object Array]' ) {","","            _events[ _tag ].forEach( function( method ) {","              obj.on( _tag, method );","            })","","          }","","          }","","        return obj;","","      },","      enumerable: true,","      configurable: true,","      writable: true","    },","    include: {","      /**","       * Include Instantiated ClusterEmitter","       *","       * If object not provided will bind to context.","       *","       * @param {Object} obj","       * @return {Object}","       */","      value: function include( obj ) {","","        var target = obj || this;","        var Instance = new ObjectEmitter.create();","","        for( var key in Instance ) {","","          Object.defineProperty( target, key, {","            value: target[ key ] || Instance[ key ],","            enumerable: false,","            writable: true,","            configurable: true","          });","","        }","","        // Ensure we have an listener container.","        if( !target._events ) {","","          Object.defineProperty( target, '_events', {","            value: {},","            enumerable: false,","            configurable: true,","            writable: true","          });","","        }","","        return target;","","      },","      enumerable: true,","      configurable: true,","      writable: true","    },","    mixin: {","      /**","       * Mixin the Emitter properties.","       *","       * @param {Object} obj","       * @return {Object}","       */","      value: function mixin( obj ) {","","        for( var key in ObjectEmitter.prototype ) {","","          var descriptor = Object.getOwnPropertyDescriptor( obj, key );","","          // Detect if a property is not configurable.","          if( descriptor && !descriptor.configurable ) {","            break;","          }","","          try {","","            Object.defineProperty( obj, key, {","              value: obj[ key ] || ObjectEmitter.prototype[ key ],","              enumerable: false,","              writable: true,","              configurable: true","            });","","          } catch( error ) {}","","        }","","        // Ensure we have an listener container.","        if( !obj._events ) {","","          Object.defineProperty( obj, '_events', {","            value: {},","            enumerable: false,","            configurable: true,","            writable: true","          });","","        }","","        return obj;","","      },","      enumerable: true,","      configurable: true,","      writable: true","    },","    eventify: {","      /**","       * Wrap Object's Methods into Events","       *","       * @param target","       * @param namespace","       * @param options","       * @returns {*}","       */","      value: function eventify( target, namespace, options ) {","","        // Enable EventChannel","        ObjectEmitter.extend( target, namespace, options );","","        // Trigger Method on Event","        Object.getOwnPropertyName( target ).forEach( function( method ) {","","          // @todo Should probably exclude all EE methods from being bound","          if( method !== 'on' && method != 'emit' && 'function' === typeof target[ method ] ) {","            target.on( method, target[ method ] );","          }","","        });","","        return this;","","      },","      enumerable: true,","      configurable: true,","      writable: true","    }","  });","","  /**","   * Constructor Properties","   *","   * The following properties are available within the constructor factory or by","   * referencing the constructor.","   *","   */","  ObjectEmitter.defineProperties( ObjectEmitter.prototype, {","","    /**","     *","     * @param event","     * @param fn","     * @returns {*}","     */","    once: function once( event, fn ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1] );","      return this.many( event, 1, fn );","    },","","    /**","     *","     * @param event","     * @param ttl","     * @param fn","     * @returns {*}","     */","    many: function many( event, ttl, fn ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1], typeof arguments[2] );","","      var self = this;","","      if( typeof fn !== 'function' ) {","        throw new Error( 'many only accepts instances of Function' );","      }","","      function listener() {","","        if( --ttl === 0 ) {","          self.off( event, listener );","        }","","        fn.apply( this, arguments );","      };","","      listener._origin = fn;","","      this.on( event, listener );","","      return this;","    },","","    /**","     *","     * @returns {*}","     */","    emit: function emit() {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] );","","      var _delimiter;","","      if( 'function' === typeof this.get && this._meta ) {","        _delimiter = this.get( 'emitter.delimiter', '.' );","      }","","      if( !this._events ) {","","        Object.defineProperty( this, '_events', {","          value: {},","          enumerable: false,","          configurable: true,","          writable: true","        });","","      }","","      // If event storage is still not set, it must be uneditable.","      if( !this._events ) {","        return;","      }","","      var type = arguments[0] && 'object' === typeof arguments[0] && Object.keys( arguments[0] ).length ? arguments[0].join( _delimiter ) : arguments[0];","","      if( !this._events ) {","","        Object.defineProperty( obj, '_events', {","          value: {},","          enumerable: false,","          configurable: true,","          writable: true","        });","","      }","","      // Loop through the ** functions and invoke them.","      if( ( this._events[ '#' ] && this._events[ '#' ].length )","        || ( this._events[ '**' ] && this._events[ '**' ].length ) ) {","        var l = arguments.length;","        var __length = this._events[ '#' ].length || this._events[ '**' ].length;","        var args = new Array( l - 1 );","        for( var i = 1; i < l; i++ ) {","          args[i - 1] = arguments[i];","        }","        for( i = 0, l = __length; i < l; i++ ) {","          this.event = type;","","          if( this._events[ '#' ] ) {","            this._events[ '#' ][i].apply( this, args );","          } else if ( this._events[ '**' ] ) {","            this._events[ '**' ][i].apply( this, args );","          }","","        }","      }","","      // If there is no 'error' event listener then throw.","      /* if( type === 'error' && !this._events[ '**' ].length && !this._events.error ) {","       throw arguments[1] instanceof Error ? arguments[1] : new Error( \"Uncaught, unspecified 'error' event.\" );","       } */","","      var handler = [];","","      if( 'undefined' === typeof type ) {","        console.error( 'type is undefined' );","        return this;","      }","","      var ns = typeof type === 'string' ? type.split( _delimiter ) : type.slice();","","      if( !this.searchListenerTree ) {","        console.error( 'Missing searchListenerTree()' );","        this.searchListenerTree = ObjectEmitter.prototype.searchListenerTree.bind( this );","      }","","      this.searchListenerTree( handler, ns, this._events, 0 );","","      if( typeof handler === 'function' ) {","        //// ObjectEmitter.logger.debug( '%s() handler %s IS a function', arguments.callee.name, type );","        this.event = type;","        if( arguments.length === 1 ) {","          handler.call( this );","        } else if( arguments.length > 1 ) {","          switch( arguments.length ) {","            case 2:","              handler.call( this, arguments[1] );","              break;","            case 3:","              handler.call( this, arguments[1], arguments[2] );","              break;","            // slower","            default:","              var l = arguments.length;","              var args = new Array( l - 1 );","              for( var i = 1; i < l; i++ ) {","                args[i - 1] = arguments[i];","              }","              handler.apply( this, args );","          }","        }","      } else if( handler ) {","        //// ObjectEmitter.logger.debug( '%s() handler %s is not a function', arguments.callee.name, type );","        var l = arguments.length;","        var args = new Array( l - 1 );","        for( var i = 1; i < l; i++ ) {","          args[i - 1] = arguments[i];","        }","        var listeners = handler.slice();","        for( var i = 0, l = listeners.length; i < l; i++ ) {","          this.event = type;","          listeners[i].apply( this, args );","        }","      }","","      return this;","","    },","","    /**","     * Add Listener","     *","     * @param type","     * @param listener","     * @returns {*}","     */","    on: function on( type, listener ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] )","","      var _delimiter = '.';","","      if( 'function' === typeof this.get && this._meta ) {","        _delimiter = this.get( 'emitter.delimiter', '.' );","      }","","      if( type === '#' ) {","        type = '**';","      }","","      // If no type specified, assume we are creating an all-event listener","      if( typeof type === 'function' ) {","        listener = type;","        type = '#';","      }","","      if( typeof listener !== 'function' ) {","        // ObjectEmitter.logger.error( this.constructor.name, ':', arguments.callee.name, ' - callback must be typeof function, not', typeof listener, 'as provided.' )","","        if( this.settings.throw ) {","          throw new Error( 'on only accepts instances of Function' );","        } else { return this; }","","      }","","      this._events || ObjectEmitter.call( this );","","      // Break the \"type\" into array parts, and remove any blank values","","","      type = typeof type === 'string' ? type.split( _delimiter ).filter( function() { return arguments[0]; }) : type.slice();","","      for( var i = 0, len = type.length; i + 1 < len; i++ ) {","        if( type[i] === '#' && type[i + 1] === '#' ) { return this; }","        if( type[i] === '**' && type[i + 1] === '**' ) { return this; }","      }","","      var tree = this._events = this._events || {};","","      var name = type.shift();","","      while( name ) {","","        if( !tree[name] ) {","          tree[name] = {};","        }","","        tree = tree[name];","","        if( type.length === 0 ) {","","          if( !tree._listeners ) {","            tree._listeners = listener;","          } else if( typeof tree._listeners === 'function' ) {","            tree._listeners = [tree._listeners, listener];","          } else if( Array.isArray( tree._listeners ) ) {","","            tree._listeners.push( listener );","","            if( !tree._listeners.warned ) {","","              var m = this.maxListeners;","","              if( typeof this._events.maxListeners !== 'undefined' ) {","                m = this._events.maxListeners;","              }","","              if( m > 0 && tree._listeners.length > m ) {","                tree._listeners.warned = true;","                console.error( '(node) warning: possible emitter leak.', tree._listeners.length );","              }","","            }","          }","","          return this;","","        }","","        name = type.shift();","","      }","","      return this;","","    },","","    /**","     * Remove Listener","     *","     * @param type","     * @param listener","     * @returns {*}","     */","    off: function off( type, listener ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0], typeof arguments[1] )","","      var _delimiter;","","      if( 'function' === typeof this.get && this._meta ) {","        _delimiter = this.get( 'emitter.delimiter', '.' );","      }","","      if( typeof listener !== 'function' ) {","        throw new Error( 'removeListener only takes instances of Function' );","      }","","      var handlers, leafs = [];","","      var ns = typeof type === 'string' ? type.split( _delimiter ) : type.slice();","","      leafs = this.searchListenerTree( null, ns, this._events, 0 );","","      for( var iLeaf = 0; iLeaf < leafs.length; iLeaf++ ) {","        var leaf = leafs[iLeaf];","        handlers = leaf._listeners;","        if( Array.isArray( handlers ) ) {","","          var position = -1;","","          for( var i = 0, length = handlers.length; i < length; i++ ) {","            if( handlers[i] === listener || (handlers[i].listener && handlers[i].listener === listener) || (handlers[i]._origin && handlers[i]._origin === listener) ) {","              position = i;","              break;","            }","          }","","          if( position < 0 ) {","            return this;","          }","","          leaf._listeners.splice( position, 1 )","","          if( handlers.length === 0 ) {","            delete leaf._listeners;","          }","","        } else if( handlers === listener || (handlers.listener && handlers.listener === listener) || (handlers._origin && handlers._origin === listener) ) {","          delete leaf._listeners;","        }","      }","","      return this;","    },","","    /**","     * Remove All Listeners","     *","     * @param type","     * @returns {*}","     */","    removeAllListeners: function removeAllListeners( type ) {","      var _delimiter = '.';","","      if( 'function' === typeof this.get && this._meta ) {","        _delimiter = this.get( 'emitter.delimiter', '.' );","      }","","      if( arguments.length === 0 ) {","        !this._events || ObjectEmitter.call( this );","        return this;","      }","","      var ns = typeof type === 'string' ? type.split( _delimiter ) : type.slice();","      var leafs = this.searchListenerTree( null, ns, this._events, 0 );","","      for( var iLeaf = 0; iLeaf < leafs.length; iLeaf++ ) {","        var leaf = leafs[iLeaf];","        leaf._listeners = null;","      }","","      return this;","","    },","","    /**","     * Get Listeners","     *","     * @param type","     * @returns {Array}","     */","    listeners: function listeners( type ) {","      // ObjectEmitter.logger.debug( arguments.callee.name, arguments[0] );","","      var _delimiter;","","      if( 'function' === typeof this.get && this._meta ) {","        _delimiter = this.get( 'emitter.delimiter', '.' );","      }","","      var handlers = [];","      var ns = typeof type === 'string' ? type.split( _delimiter ) : type.slice();","","      this.searchListenerTree( handlers, ns, this._events, 0 );","","      return handlers;","","    },","","    searchListenerTree: {","      /**","       * Search Listener Tree","       * @param handlers","       * @param type","       * @param tree","       * @param i","       * @returns {Array}","       */","      value: function searchListenerTree( handlers, type, tree, i ) {","        // ObjectEmitter.logger.debug( arguments.callee.name, handlers, type, typeof tree, i );","","        if( !tree ) {","          return [];","        }","","        var self = this;","","        var listeners = [], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached, typeLength = type.length, currentType = type[i], nextType = type[i + 1];","","        if( i === typeLength && tree._listeners ) {","","          if( typeof tree._listeners === 'function' ) {","            handlers && handlers.push( tree._listeners );","            return [tree];","","          } else {","            for( leaf = 0, len = tree._listeners.length; leaf < len; leaf++ ) {","              handlers && handlers.push( tree._listeners[leaf] );","            }","            return [tree];","          }","","        }","","        if( ( currentType === '*' || currentType === '**' || currentType === '#' ) || tree[ currentType ] ) {","","          if( currentType === '*' ) {","            for( branch in tree ) {","              if( branch !== '_listeners' && tree.hasOwnProperty( branch ) ) {","                listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i + 1 ) );","              }","            }","            return listeners;","","          } else if( currentType === '**' || currentType === '#' ) {","            endReached = (i + 1 === typeLength || (i + 2 === typeLength && nextType === '*'));","            if( endReached && tree._listeners ) {","              // The next element has a _listeners, add it to the handlers.","              listeners = listeners.concat( this.searchListenerTree( handlers, type, tree, typeLength ) );","            }","","            for( branch in tree ) {","              if( branch !== '_listeners' && tree.hasOwnProperty( branch ) ) {","                if( branch === '*' || ( branch === '**' || branch === '#' ) ) {","                  if( tree[branch]._listeners && !endReached ) {","                    listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], typeLength ) );","                  }","                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i ) );","                } else if( branch === nextType ) {","                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i + 2 ) );","                } else {","                  // No match on this one, shift into the tree but not in the type array.","                  listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[branch], i ) );","                }","              }","            }","            return listeners;","          }","","          listeners = listeners.concat( this.searchListenerTree( handlers, type, tree[currentType], i + 1 ) );","","        }","","        xTree = tree['*'];","","        if( xTree ) {","          this.searchListenerTree( handlers, type, xTree, i + 1 );","        }","","        xxTree = tree[ '**' ];","","        if( xxTree ) {","          if( i < typeLength ) {","","            if( xxTree._listeners ) {","              this.searchListenerTree( handlers, type, xxTree, typeLength );","            }","","            // Build arrays of matching next branches and others.","            for( branch in xxTree ) {","              if( branch !== '_listeners' && xxTree.hasOwnProperty( branch ) ) {","                if( branch === nextType ) {","                  // We know the next element will match, so jump twice.","                  this.searchListenerTree( handlers, type, xxTree[branch], i + 2 );","                } else if( branch === currentType ) {","                  // Current node matches, move into the tree.","                  this.searchListenerTree( handlers, type, xxTree[branch], i + 1 );","                } else {","                  isolatedBranch = {};","                  isolatedBranch[branch] = xxTree[branch];","                  this.searchListenerTree( handlers, type, { '#': isolatedBranch }, i + 1 );","                }","              }","            }","          } else if( xxTree._listeners ) {","            // We have reached the end and still on a '#'","            this.searchListenerTree( handlers, type, xxTree, typeLength );","          } else if( xxTree['*'] && xxTree['*']._listeners ) {","            this.searchListenerTree( handlers, type, xxTree['*'], typeLength );","          }","        }","","        return listeners;","","      },","      writable: true,","      configurable: true,","      enumerable: true","    }","","  });","","  /**","   * Emitter Constructor.","   *","   */","  ObjectEmitter.defineConstructor( function create( options ) {","    var Instance = this;","","    Instance.properties({","      _events: {","        value: {},","        enumerable: false","      }","    });","","    // if there is an active domain, then attach to it.","    if( 'function' === typeof this.get && this._meta && Instance.get( 'usingDomains' ) ) {","      domain = domain || require( 'domain' );","      if( domain.active && !( Instance instanceof domain.Domain )) {","","        Instance.properties({","          domain: {","            value: domain.active,","            enumerable: false","          }","        });","","      }","    }","","    return Instance;","","  });","","});",""];
_$jscoverage_done("lib/object-emitter.js", 11);
require("abstract").createModel(module.exports = function ObjectEmitter() {
    _$jscoverage_done("lib/object-emitter.js", 14);
    if (_$jscoverage_done("lib/object-emitter.js", 14, module.loaded)) {
        _$jscoverage_done("lib/object-emitter.js", 15);
        return ObjectEmitter;
    }
    _$jscoverage_done("lib/object-emitter.js", 19);
    var domain = require("domain");
    _$jscoverage_done("lib/object-emitter.js", 20);
    var util = require("util");
    _$jscoverage_done("lib/object-emitter.js", 26);
    ObjectEmitter.defineProperties(ObjectEmitter, {
        inject: {
            value: function inject(obj) {
                _$jscoverage_done("lib/object-emitter.js", 40);
                var Instance = new ObjectEmitter.create;
                _$jscoverage_done("lib/object-emitter.js", 41);
                var _events = obj._events || {};
                _$jscoverage_done("lib/object-emitter.js", 43);
                Object.getOwnPropertyNames(ObjectEmitter.prototype).forEach(function(key) {
                    _$jscoverage_done("lib/object-emitter.js", 45);
                    var descriptor = Object.getOwnPropertyDescriptor(obj, key);
                    _$jscoverage_done("lib/object-emitter.js", 47);
                    Object.defineProperty(obj, key, {
                        value: Instance[key],
                        enumerable: descriptor ? descriptor.enumerable : false,
                        writable: true,
                        configurable: true
                    });
                });
                _$jscoverage_done("lib/object-emitter.js", 58);
                Object.defineProperty(obj, "_events", {
                    value: _events,
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
                _$jscoverage_done("lib/object-emitter.js", 66);
                for (var _tag in _events) {
                    _$jscoverage_done("lib/object-emitter.js", 68);
                    if (_$jscoverage_done("lib/object-emitter.js", 68, "function" === typeof _events[_tag])) {
                        _$jscoverage_done("lib/object-emitter.js", 69);
                        obj.on(_tag, _events[_tag]);
                    }
                    _$jscoverage_done("lib/object-emitter.js", 72);
                    if (_$jscoverage_done("lib/object-emitter.js", 72, Object.prototype.toString.call(_events[_tag]) === "[object Array]")) {
                        _$jscoverage_done("lib/object-emitter.js", 74);
                        _events[_tag].forEach(function(method) {
                            _$jscoverage_done("lib/object-emitter.js", 75);
                            obj.on(_tag, method);
                        });
                    }
                }
                _$jscoverage_done("lib/object-emitter.js", 82);
                return obj;
            },
            enumerable: true,
            configurable: true,
            writable: true
        },
        include: {
            value: function include(obj) {
                _$jscoverage_done("lib/object-emitter.js", 100);
                var target = obj || this;
                _$jscoverage_done("lib/object-emitter.js", 101);
                var Instance = new ObjectEmitter.create;
                _$jscoverage_done("lib/object-emitter.js", 103);
                for (var key in Instance) {
                    _$jscoverage_done("lib/object-emitter.js", 105);
                    Object.defineProperty(target, key, {
                        value: target[key] || Instance[key],
                        enumerable: false,
                        writable: true,
                        configurable: true
                    });
                }
                _$jscoverage_done("lib/object-emitter.js", 115);
                if (_$jscoverage_done("lib/object-emitter.js", 115, !target._events)) {
                    _$jscoverage_done("lib/object-emitter.js", 117);
                    Object.defineProperty(target, "_events", {
                        value: {},
                        enumerable: false,
                        configurable: true,
                        writable: true
                    });
                }
                _$jscoverage_done("lib/object-emitter.js", 126);
                return target;
            },
            enumerable: true,
            configurable: true,
            writable: true
        },
        mixin: {
            value: function mixin(obj) {
                _$jscoverage_done("lib/object-emitter.js", 142);
                for (var key in ObjectEmitter.prototype) {
                    _$jscoverage_done("lib/object-emitter.js", 144);
                    var descriptor = Object.getOwnPropertyDescriptor(obj, key);
                    _$jscoverage_done("lib/object-emitter.js", 147);
                    if (_$jscoverage_done("lib/object-emitter.js", 147, descriptor) && _$jscoverage_done("lib/object-emitter.js", 147, !descriptor.configurable)) {
                        _$jscoverage_done("lib/object-emitter.js", 148);
                        break;
                    }
                    _$jscoverage_done("lib/object-emitter.js", 151);
                    try {
                        _$jscoverage_done("lib/object-emitter.js", 153);
                        Object.defineProperty(obj, key, {
                            value: obj[key] || ObjectEmitter.prototype[key],
                            enumerable: false,
                            writable: true,
                            configurable: true
                        });
                    } catch (error) {}
                }
                _$jscoverage_done("lib/object-emitter.js", 165);
                if (_$jscoverage_done("lib/object-emitter.js", 165, !obj._events)) {
                    _$jscoverage_done("lib/object-emitter.js", 167);
                    Object.defineProperty(obj, "_events", {
                        value: {},
                        enumerable: false,
                        configurable: true,
                        writable: true
                    });
                }
                _$jscoverage_done("lib/object-emitter.js", 176);
                return obj;
            },
            enumerable: true,
            configurable: true,
            writable: true
        },
        eventify: {
            value: function eventify(target, namespace, options) {
                _$jscoverage_done("lib/object-emitter.js", 195);
                ObjectEmitter.extend(target, namespace, options);
                _$jscoverage_done("lib/object-emitter.js", 198);
                Object.getOwnPropertyName(target).forEach(function(method) {
                    _$jscoverage_done("lib/object-emitter.js", 201);
                    if (_$jscoverage_done("lib/object-emitter.js", 201, method !== "on") && _$jscoverage_done("lib/object-emitter.js", 201, method != "emit") && _$jscoverage_done("lib/object-emitter.js", 201, "function" === typeof target[method])) {
                        _$jscoverage_done("lib/object-emitter.js", 202);
                        target.on(method, target[method]);
                    }
                });
                _$jscoverage_done("lib/object-emitter.js", 207);
                return this;
            },
            enumerable: true,
            configurable: true,
            writable: true
        }
    });
    _$jscoverage_done("lib/object-emitter.js", 223);
    ObjectEmitter.defineProperties(ObjectEmitter.prototype, {
        once: function once(event, fn) {
            _$jscoverage_done("lib/object-emitter.js", 233);
            return this.many(event, 1, fn);
        },
        many: function many(event, ttl, fn) {
            _$jscoverage_done("lib/object-emitter.js", 246);
            var self = this;
            _$jscoverage_done("lib/object-emitter.js", 248);
            if (_$jscoverage_done("lib/object-emitter.js", 248, typeof fn !== "function")) {
                _$jscoverage_done("lib/object-emitter.js", 249);
                throw new Error("many only accepts instances of Function");
            }
            function listener() {
                _$jscoverage_done("lib/object-emitter.js", 254);
                if (_$jscoverage_done("lib/object-emitter.js", 254, --ttl === 0)) {
                    _$jscoverage_done("lib/object-emitter.js", 255);
                    self.off(event, listener);
                }
                _$jscoverage_done("lib/object-emitter.js", 258);
                fn.apply(this, arguments);
            }
            _$jscoverage_done("lib/object-emitter.js", 261);
            listener._origin = fn;
            _$jscoverage_done("lib/object-emitter.js", 263);
            this.on(event, listener);
            _$jscoverage_done("lib/object-emitter.js", 265);
            return this;
        },
        emit: function emit() {
            _$jscoverage_done("lib/object-emitter.js", 275);
            var _delimiter;
            _$jscoverage_done("lib/object-emitter.js", 277);
            if (_$jscoverage_done("lib/object-emitter.js", 277, "function" === typeof this.get) && _$jscoverage_done("lib/object-emitter.js", 277, this._meta)) {
                _$jscoverage_done("lib/object-emitter.js", 278);
                _delimiter = this.get("emitter.delimiter", ".");
            }
            _$jscoverage_done("lib/object-emitter.js", 281);
            if (_$jscoverage_done("lib/object-emitter.js", 281, !this._events)) {
                _$jscoverage_done("lib/object-emitter.js", 283);
                Object.defineProperty(this, "_events", {
                    value: {},
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
            }
            _$jscoverage_done("lib/object-emitter.js", 293);
            if (_$jscoverage_done("lib/object-emitter.js", 293, !this._events)) {
                _$jscoverage_done("lib/object-emitter.js", 294);
                return;
            }
            _$jscoverage_done("lib/object-emitter.js", 297);
            var type = arguments[0] && "object" === typeof arguments[0] && Object.keys(arguments[0]).length ? arguments[0].join(_delimiter) : arguments[0];
            _$jscoverage_done("lib/object-emitter.js", 299);
            if (_$jscoverage_done("lib/object-emitter.js", 299, !this._events)) {
                _$jscoverage_done("lib/object-emitter.js", 301);
                Object.defineProperty(obj, "_events", {
                    value: {},
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
            }
            _$jscoverage_done("lib/object-emitter.js", 311);
            if (_$jscoverage_done("lib/object-emitter.js", 311, this._events["#"]) && _$jscoverage_done("lib/object-emitter.js", 311, this._events["#"].length) || _$jscoverage_done("lib/object-emitter.js", 311, this._events["**"]) && _$jscoverage_done("lib/object-emitter.js", 311, this._events["**"].length)) {
                _$jscoverage_done("lib/object-emitter.js", 313);
                var l = arguments.length;
                _$jscoverage_done("lib/object-emitter.js", 314);
                var __length = this._events["#"].length || this._events["**"].length;
                _$jscoverage_done("lib/object-emitter.js", 315);
                var args = new Array(l - 1);
                _$jscoverage_done("lib/object-emitter.js", 316);
                for (var i = 1; i < l; i++) {
                    _$jscoverage_done("lib/object-emitter.js", 317);
                    args[i - 1] = arguments[i];
                }
                _$jscoverage_done("lib/object-emitter.js", 319);
                for (i = 0, l = __length; i < l; i++) {
                    _$jscoverage_done("lib/object-emitter.js", 320);
                    this.event = type;
                    _$jscoverage_done("lib/object-emitter.js", 322);
                    if (_$jscoverage_done("lib/object-emitter.js", 322, this._events["#"])) {
                        _$jscoverage_done("lib/object-emitter.js", 323);
                        this._events["#"][i].apply(this, args);
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 324);
                        if (_$jscoverage_done("lib/object-emitter.js", 324, this._events["**"])) {
                            _$jscoverage_done("lib/object-emitter.js", 325);
                            this._events["**"][i].apply(this, args);
                        }
                    }
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 336);
            var handler = [];
            _$jscoverage_done("lib/object-emitter.js", 338);
            if (_$jscoverage_done("lib/object-emitter.js", 338, "undefined" === typeof type)) {
                _$jscoverage_done("lib/object-emitter.js", 339);
                console.error("type is undefined");
                _$jscoverage_done("lib/object-emitter.js", 340);
                return this;
            }
            _$jscoverage_done("lib/object-emitter.js", 343);
            var ns = typeof type === "string" ? type.split(_delimiter) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 345);
            if (_$jscoverage_done("lib/object-emitter.js", 345, !this.searchListenerTree)) {
                _$jscoverage_done("lib/object-emitter.js", 346);
                console.error("Missing searchListenerTree()");
                _$jscoverage_done("lib/object-emitter.js", 347);
                this.searchListenerTree = ObjectEmitter.prototype.searchListenerTree.bind(this);
            }
            _$jscoverage_done("lib/object-emitter.js", 350);
            this.searchListenerTree(handler, ns, this._events, 0);
            _$jscoverage_done("lib/object-emitter.js", 352);
            if (_$jscoverage_done("lib/object-emitter.js", 352, typeof handler === "function")) {
                _$jscoverage_done("lib/object-emitter.js", 354);
                this.event = type;
                _$jscoverage_done("lib/object-emitter.js", 355);
                if (_$jscoverage_done("lib/object-emitter.js", 355, arguments.length === 1)) {
                    _$jscoverage_done("lib/object-emitter.js", 356);
                    handler.call(this);
                } else {
                    _$jscoverage_done("lib/object-emitter.js", 357);
                    if (_$jscoverage_done("lib/object-emitter.js", 357, arguments.length > 1)) {
                        _$jscoverage_done("lib/object-emitter.js", 358);
                        switch (arguments.length) {
                          case 2:
                            _$jscoverage_done("lib/object-emitter.js", 360);
                            handler.call(this, arguments[1]);
                            _$jscoverage_done("lib/object-emitter.js", 361);
                            break;
                          case 3:
                            _$jscoverage_done("lib/object-emitter.js", 363);
                            handler.call(this, arguments[1], arguments[2]);
                            _$jscoverage_done("lib/object-emitter.js", 364);
                            break;
                          default:
                            _$jscoverage_done("lib/object-emitter.js", 367);
                            var l = arguments.length;
                            _$jscoverage_done("lib/object-emitter.js", 368);
                            var args = new Array(l - 1);
                            _$jscoverage_done("lib/object-emitter.js", 369);
                            for (var i = 1; i < l; i++) {
                                _$jscoverage_done("lib/object-emitter.js", 370);
                                args[i - 1] = arguments[i];
                            }
                            _$jscoverage_done("lib/object-emitter.js", 372);
                            handler.apply(this, args);
                        }
                    }
                }
            } else {
                _$jscoverage_done("lib/object-emitter.js", 375);
                if (_$jscoverage_done("lib/object-emitter.js", 375, handler)) {
                    _$jscoverage_done("lib/object-emitter.js", 377);
                    var l = arguments.length;
                    _$jscoverage_done("lib/object-emitter.js", 378);
                    var args = new Array(l - 1);
                    _$jscoverage_done("lib/object-emitter.js", 379);
                    for (var i = 1; i < l; i++) {
                        _$jscoverage_done("lib/object-emitter.js", 380);
                        args[i - 1] = arguments[i];
                    }
                    _$jscoverage_done("lib/object-emitter.js", 382);
                    var listeners = handler.slice();
                    _$jscoverage_done("lib/object-emitter.js", 383);
                    for (var i = 0, l = listeners.length; i < l; i++) {
                        _$jscoverage_done("lib/object-emitter.js", 384);
                        this.event = type;
                        _$jscoverage_done("lib/object-emitter.js", 385);
                        listeners[i].apply(this, args);
                    }
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 389);
            return this;
        },
        on: function on(type, listener) {
            _$jscoverage_done("lib/object-emitter.js", 403);
            var _delimiter = ".";
            _$jscoverage_done("lib/object-emitter.js", 405);
            if (_$jscoverage_done("lib/object-emitter.js", 405, "function" === typeof this.get) && _$jscoverage_done("lib/object-emitter.js", 405, this._meta)) {
                _$jscoverage_done("lib/object-emitter.js", 406);
                _delimiter = this.get("emitter.delimiter", ".");
            }
            _$jscoverage_done("lib/object-emitter.js", 409);
            if (_$jscoverage_done("lib/object-emitter.js", 409, type === "#")) {
                _$jscoverage_done("lib/object-emitter.js", 410);
                type = "**";
            }
            _$jscoverage_done("lib/object-emitter.js", 414);
            if (_$jscoverage_done("lib/object-emitter.js", 414, typeof type === "function")) {
                _$jscoverage_done("lib/object-emitter.js", 415);
                listener = type;
                _$jscoverage_done("lib/object-emitter.js", 416);
                type = "#";
            }
            _$jscoverage_done("lib/object-emitter.js", 419);
            if (_$jscoverage_done("lib/object-emitter.js", 419, typeof listener !== "function")) {
                _$jscoverage_done("lib/object-emitter.js", 422);
                if (_$jscoverage_done("lib/object-emitter.js", 422, this.settings.throw)) {
                    _$jscoverage_done("lib/object-emitter.js", 423);
                    throw new Error("on only accepts instances of Function");
                } else {
                    _$jscoverage_done("lib/object-emitter.js", 424);
                    return this;
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 428);
            this._events || ObjectEmitter.call(this);
            _$jscoverage_done("lib/object-emitter.js", 433);
            type = typeof type === "string" ? type.split(_delimiter).filter(function() {
                _$jscoverage_done("lib/object-emitter.js", 433);
                return arguments[0];
            }) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 435);
            for (var i = 0, len = type.length; i + 1 < len; i++) {
                _$jscoverage_done("lib/object-emitter.js", 436);
                if (_$jscoverage_done("lib/object-emitter.js", 436, type[i] === "#") && _$jscoverage_done("lib/object-emitter.js", 436, type[i + 1] === "#")) {
                    _$jscoverage_done("lib/object-emitter.js", 436);
                    return this;
                }
                _$jscoverage_done("lib/object-emitter.js", 437);
                if (_$jscoverage_done("lib/object-emitter.js", 437, type[i] === "**") && _$jscoverage_done("lib/object-emitter.js", 437, type[i + 1] === "**")) {
                    _$jscoverage_done("lib/object-emitter.js", 437);
                    return this;
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 440);
            var tree = this._events = this._events || {};
            _$jscoverage_done("lib/object-emitter.js", 442);
            var name = type.shift();
            _$jscoverage_done("lib/object-emitter.js", 444);
            while (name) {
                _$jscoverage_done("lib/object-emitter.js", 446);
                if (_$jscoverage_done("lib/object-emitter.js", 446, !tree[name])) {
                    _$jscoverage_done("lib/object-emitter.js", 447);
                    tree[name] = {};
                }
                _$jscoverage_done("lib/object-emitter.js", 450);
                tree = tree[name];
                _$jscoverage_done("lib/object-emitter.js", 452);
                if (_$jscoverage_done("lib/object-emitter.js", 452, type.length === 0)) {
                    _$jscoverage_done("lib/object-emitter.js", 454);
                    if (_$jscoverage_done("lib/object-emitter.js", 454, !tree._listeners)) {
                        _$jscoverage_done("lib/object-emitter.js", 455);
                        tree._listeners = listener;
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 456);
                        if (_$jscoverage_done("lib/object-emitter.js", 456, typeof tree._listeners === "function")) {
                            _$jscoverage_done("lib/object-emitter.js", 457);
                            tree._listeners = [ tree._listeners, listener ];
                        } else {
                            _$jscoverage_done("lib/object-emitter.js", 458);
                            if (_$jscoverage_done("lib/object-emitter.js", 458, Array.isArray(tree._listeners))) {
                                _$jscoverage_done("lib/object-emitter.js", 460);
                                tree._listeners.push(listener);
                                _$jscoverage_done("lib/object-emitter.js", 462);
                                if (_$jscoverage_done("lib/object-emitter.js", 462, !tree._listeners.warned)) {
                                    _$jscoverage_done("lib/object-emitter.js", 464);
                                    var m = this.maxListeners;
                                    _$jscoverage_done("lib/object-emitter.js", 466);
                                    if (_$jscoverage_done("lib/object-emitter.js", 466, typeof this._events.maxListeners !== "undefined")) {
                                        _$jscoverage_done("lib/object-emitter.js", 467);
                                        m = this._events.maxListeners;
                                    }
                                    _$jscoverage_done("lib/object-emitter.js", 470);
                                    if (_$jscoverage_done("lib/object-emitter.js", 470, m > 0) && _$jscoverage_done("lib/object-emitter.js", 470, tree._listeners.length > m)) {
                                        _$jscoverage_done("lib/object-emitter.js", 471);
                                        tree._listeners.warned = true;
                                        _$jscoverage_done("lib/object-emitter.js", 472);
                                        console.error("(node) warning: possible emitter leak.", tree._listeners.length);
                                    }
                                }
                            }
                        }
                    }
                    _$jscoverage_done("lib/object-emitter.js", 478);
                    return this;
                }
                _$jscoverage_done("lib/object-emitter.js", 482);
                name = type.shift();
            }
            _$jscoverage_done("lib/object-emitter.js", 486);
            return this;
        },
        off: function off(type, listener) {
            _$jscoverage_done("lib/object-emitter.js", 500);
            var _delimiter;
            _$jscoverage_done("lib/object-emitter.js", 502);
            if (_$jscoverage_done("lib/object-emitter.js", 502, "function" === typeof this.get) && _$jscoverage_done("lib/object-emitter.js", 502, this._meta)) {
                _$jscoverage_done("lib/object-emitter.js", 503);
                _delimiter = this.get("emitter.delimiter", ".");
            }
            _$jscoverage_done("lib/object-emitter.js", 506);
            if (_$jscoverage_done("lib/object-emitter.js", 506, typeof listener !== "function")) {
                _$jscoverage_done("lib/object-emitter.js", 507);
                throw new Error("removeListener only takes instances of Function");
            }
            _$jscoverage_done("lib/object-emitter.js", 510);
            var handlers, leafs = [];
            _$jscoverage_done("lib/object-emitter.js", 512);
            var ns = typeof type === "string" ? type.split(_delimiter) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 514);
            leafs = this.searchListenerTree(null, ns, this._events, 0);
            _$jscoverage_done("lib/object-emitter.js", 516);
            for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
                _$jscoverage_done("lib/object-emitter.js", 517);
                var leaf = leafs[iLeaf];
                _$jscoverage_done("lib/object-emitter.js", 518);
                handlers = leaf._listeners;
                _$jscoverage_done("lib/object-emitter.js", 519);
                if (_$jscoverage_done("lib/object-emitter.js", 519, Array.isArray(handlers))) {
                    _$jscoverage_done("lib/object-emitter.js", 521);
                    var position = -1;
                    _$jscoverage_done("lib/object-emitter.js", 523);
                    for (var i = 0, length = handlers.length; i < length; i++) {
                        _$jscoverage_done("lib/object-emitter.js", 524);
                        if (_$jscoverage_done("lib/object-emitter.js", 524, handlers[i] === listener) || _$jscoverage_done("lib/object-emitter.js", 524, handlers[i].listener) && _$jscoverage_done("lib/object-emitter.js", 524, handlers[i].listener === listener) || _$jscoverage_done("lib/object-emitter.js", 524, handlers[i]._origin) && _$jscoverage_done("lib/object-emitter.js", 524, handlers[i]._origin === listener)) {
                            _$jscoverage_done("lib/object-emitter.js", 525);
                            position = i;
                            _$jscoverage_done("lib/object-emitter.js", 526);
                            break;
                        }
                    }
                    _$jscoverage_done("lib/object-emitter.js", 530);
                    if (_$jscoverage_done("lib/object-emitter.js", 530, position < 0)) {
                        _$jscoverage_done("lib/object-emitter.js", 531);
                        return this;
                    }
                    _$jscoverage_done("lib/object-emitter.js", 534);
                    leaf._listeners.splice(position, 1);
                    _$jscoverage_done("lib/object-emitter.js", 536);
                    if (_$jscoverage_done("lib/object-emitter.js", 536, handlers.length === 0)) {
                        _$jscoverage_done("lib/object-emitter.js", 537);
                        delete leaf._listeners;
                    }
                } else {
                    _$jscoverage_done("lib/object-emitter.js", 540);
                    if (_$jscoverage_done("lib/object-emitter.js", 540, handlers === listener) || _$jscoverage_done("lib/object-emitter.js", 540, handlers.listener) && _$jscoverage_done("lib/object-emitter.js", 540, handlers.listener === listener) || _$jscoverage_done("lib/object-emitter.js", 540, handlers._origin) && _$jscoverage_done("lib/object-emitter.js", 540, handlers._origin === listener)) {
                        _$jscoverage_done("lib/object-emitter.js", 541);
                        delete leaf._listeners;
                    }
                }
            }
            _$jscoverage_done("lib/object-emitter.js", 545);
            return this;
        },
        removeAllListeners: function removeAllListeners(type) {
            _$jscoverage_done("lib/object-emitter.js", 555);
            var _delimiter = ".";
            _$jscoverage_done("lib/object-emitter.js", 557);
            if (_$jscoverage_done("lib/object-emitter.js", 557, "function" === typeof this.get) && _$jscoverage_done("lib/object-emitter.js", 557, this._meta)) {
                _$jscoverage_done("lib/object-emitter.js", 558);
                _delimiter = this.get("emitter.delimiter", ".");
            }
            _$jscoverage_done("lib/object-emitter.js", 561);
            if (_$jscoverage_done("lib/object-emitter.js", 561, arguments.length === 0)) {
                _$jscoverage_done("lib/object-emitter.js", 562);
                !this._events || ObjectEmitter.call(this);
                _$jscoverage_done("lib/object-emitter.js", 563);
                return this;
            }
            _$jscoverage_done("lib/object-emitter.js", 566);
            var ns = typeof type === "string" ? type.split(_delimiter) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 567);
            var leafs = this.searchListenerTree(null, ns, this._events, 0);
            _$jscoverage_done("lib/object-emitter.js", 569);
            for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
                _$jscoverage_done("lib/object-emitter.js", 570);
                var leaf = leafs[iLeaf];
                _$jscoverage_done("lib/object-emitter.js", 571);
                leaf._listeners = null;
            }
            _$jscoverage_done("lib/object-emitter.js", 574);
            return this;
        },
        listeners: function listeners(type) {
            _$jscoverage_done("lib/object-emitter.js", 587);
            var _delimiter;
            _$jscoverage_done("lib/object-emitter.js", 589);
            if (_$jscoverage_done("lib/object-emitter.js", 589, "function" === typeof this.get) && _$jscoverage_done("lib/object-emitter.js", 589, this._meta)) {
                _$jscoverage_done("lib/object-emitter.js", 590);
                _delimiter = this.get("emitter.delimiter", ".");
            }
            _$jscoverage_done("lib/object-emitter.js", 593);
            var handlers = [];
            _$jscoverage_done("lib/object-emitter.js", 594);
            var ns = typeof type === "string" ? type.split(_delimiter) : type.slice();
            _$jscoverage_done("lib/object-emitter.js", 596);
            this.searchListenerTree(handlers, ns, this._events, 0);
            _$jscoverage_done("lib/object-emitter.js", 598);
            return handlers;
        },
        searchListenerTree: {
            value: function searchListenerTree(handlers, type, tree, i) {
                _$jscoverage_done("lib/object-emitter.js", 614);
                if (_$jscoverage_done("lib/object-emitter.js", 614, !tree)) {
                    _$jscoverage_done("lib/object-emitter.js", 615);
                    return [];
                }
                _$jscoverage_done("lib/object-emitter.js", 618);
                var self = this;
                _$jscoverage_done("lib/object-emitter.js", 620);
                var listeners = [], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached, typeLength = type.length, currentType = type[i], nextType = type[i + 1];
                _$jscoverage_done("lib/object-emitter.js", 622);
                if (_$jscoverage_done("lib/object-emitter.js", 622, i === typeLength) && _$jscoverage_done("lib/object-emitter.js", 622, tree._listeners)) {
                    _$jscoverage_done("lib/object-emitter.js", 624);
                    if (_$jscoverage_done("lib/object-emitter.js", 624, typeof tree._listeners === "function")) {
                        _$jscoverage_done("lib/object-emitter.js", 625);
                        handlers && handlers.push(tree._listeners);
                        _$jscoverage_done("lib/object-emitter.js", 626);
                        return [ tree ];
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 629);
                        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
                            _$jscoverage_done("lib/object-emitter.js", 630);
                            handlers && handlers.push(tree._listeners[leaf]);
                        }
                        _$jscoverage_done("lib/object-emitter.js", 632);
                        return [ tree ];
                    }
                }
                _$jscoverage_done("lib/object-emitter.js", 637);
                if (_$jscoverage_done("lib/object-emitter.js", 637, currentType === "*") || _$jscoverage_done("lib/object-emitter.js", 637, currentType === "**") || _$jscoverage_done("lib/object-emitter.js", 637, currentType === "#") || _$jscoverage_done("lib/object-emitter.js", 637, tree[currentType])) {
                    _$jscoverage_done("lib/object-emitter.js", 639);
                    if (_$jscoverage_done("lib/object-emitter.js", 639, currentType === "*")) {
                        _$jscoverage_done("lib/object-emitter.js", 640);
                        for (branch in tree) {
                            _$jscoverage_done("lib/object-emitter.js", 641);
                            if (_$jscoverage_done("lib/object-emitter.js", 641, branch !== "_listeners") && _$jscoverage_done("lib/object-emitter.js", 641, tree.hasOwnProperty(branch))) {
                                _$jscoverage_done("lib/object-emitter.js", 642);
                                listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], i + 1));
                            }
                        }
                        _$jscoverage_done("lib/object-emitter.js", 645);
                        return listeners;
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 647);
                        if (_$jscoverage_done("lib/object-emitter.js", 647, currentType === "**") || _$jscoverage_done("lib/object-emitter.js", 647, currentType === "#")) {
                            _$jscoverage_done("lib/object-emitter.js", 648);
                            endReached = i + 1 === typeLength || i + 2 === typeLength && nextType === "*";
                            _$jscoverage_done("lib/object-emitter.js", 649);
                            if (_$jscoverage_done("lib/object-emitter.js", 649, endReached) && _$jscoverage_done("lib/object-emitter.js", 649, tree._listeners)) {
                                _$jscoverage_done("lib/object-emitter.js", 651);
                                listeners = listeners.concat(this.searchListenerTree(handlers, type, tree, typeLength));
                            }
                            _$jscoverage_done("lib/object-emitter.js", 654);
                            for (branch in tree) {
                                _$jscoverage_done("lib/object-emitter.js", 655);
                                if (_$jscoverage_done("lib/object-emitter.js", 655, branch !== "_listeners") && _$jscoverage_done("lib/object-emitter.js", 655, tree.hasOwnProperty(branch))) {
                                    _$jscoverage_done("lib/object-emitter.js", 656);
                                    if (_$jscoverage_done("lib/object-emitter.js", 656, branch === "*") || _$jscoverage_done("lib/object-emitter.js", 656, branch === "**") || _$jscoverage_done("lib/object-emitter.js", 656, branch === "#")) {
                                        _$jscoverage_done("lib/object-emitter.js", 657);
                                        if (_$jscoverage_done("lib/object-emitter.js", 657, tree[branch]._listeners) && _$jscoverage_done("lib/object-emitter.js", 657, !endReached)) {
                                            _$jscoverage_done("lib/object-emitter.js", 658);
                                            listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], typeLength));
                                        }
                                        _$jscoverage_done("lib/object-emitter.js", 660);
                                        listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], i));
                                    } else {
                                        _$jscoverage_done("lib/object-emitter.js", 661);
                                        if (_$jscoverage_done("lib/object-emitter.js", 661, branch === nextType)) {
                                            _$jscoverage_done("lib/object-emitter.js", 662);
                                            listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], i + 2));
                                        } else {
                                            _$jscoverage_done("lib/object-emitter.js", 665);
                                            listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[branch], i));
                                        }
                                    }
                                }
                            }
                            _$jscoverage_done("lib/object-emitter.js", 669);
                            return listeners;
                        }
                    }
                    _$jscoverage_done("lib/object-emitter.js", 672);
                    listeners = listeners.concat(this.searchListenerTree(handlers, type, tree[currentType], i + 1));
                }
                _$jscoverage_done("lib/object-emitter.js", 676);
                xTree = tree["*"];
                _$jscoverage_done("lib/object-emitter.js", 678);
                if (_$jscoverage_done("lib/object-emitter.js", 678, xTree)) {
                    _$jscoverage_done("lib/object-emitter.js", 679);
                    this.searchListenerTree(handlers, type, xTree, i + 1);
                }
                _$jscoverage_done("lib/object-emitter.js", 682);
                xxTree = tree["**"];
                _$jscoverage_done("lib/object-emitter.js", 684);
                if (_$jscoverage_done("lib/object-emitter.js", 684, xxTree)) {
                    _$jscoverage_done("lib/object-emitter.js", 685);
                    if (_$jscoverage_done("lib/object-emitter.js", 685, i < typeLength)) {
                        _$jscoverage_done("lib/object-emitter.js", 687);
                        if (_$jscoverage_done("lib/object-emitter.js", 687, xxTree._listeners)) {
                            _$jscoverage_done("lib/object-emitter.js", 688);
                            this.searchListenerTree(handlers, type, xxTree, typeLength);
                        }
                        _$jscoverage_done("lib/object-emitter.js", 692);
                        for (branch in xxTree) {
                            _$jscoverage_done("lib/object-emitter.js", 693);
                            if (_$jscoverage_done("lib/object-emitter.js", 693, branch !== "_listeners") && _$jscoverage_done("lib/object-emitter.js", 693, xxTree.hasOwnProperty(branch))) {
                                _$jscoverage_done("lib/object-emitter.js", 694);
                                if (_$jscoverage_done("lib/object-emitter.js", 694, branch === nextType)) {
                                    _$jscoverage_done("lib/object-emitter.js", 696);
                                    this.searchListenerTree(handlers, type, xxTree[branch], i + 2);
                                } else {
                                    _$jscoverage_done("lib/object-emitter.js", 697);
                                    if (_$jscoverage_done("lib/object-emitter.js", 697, branch === currentType)) {
                                        _$jscoverage_done("lib/object-emitter.js", 699);
                                        this.searchListenerTree(handlers, type, xxTree[branch], i + 1);
                                    } else {
                                        _$jscoverage_done("lib/object-emitter.js", 701);
                                        isolatedBranch = {};
                                        _$jscoverage_done("lib/object-emitter.js", 702);
                                        isolatedBranch[branch] = xxTree[branch];
                                        _$jscoverage_done("lib/object-emitter.js", 703);
                                        this.searchListenerTree(handlers, type, {
                                            "#": isolatedBranch
                                        }, i + 1);
                                    }
                                }
                            }
                        }
                    } else {
                        _$jscoverage_done("lib/object-emitter.js", 707);
                        if (_$jscoverage_done("lib/object-emitter.js", 707, xxTree._listeners)) {
                            _$jscoverage_done("lib/object-emitter.js", 709);
                            this.searchListenerTree(handlers, type, xxTree, typeLength);
                        } else {
                            _$jscoverage_done("lib/object-emitter.js", 710);
                            if (_$jscoverage_done("lib/object-emitter.js", 710, xxTree["*"]) && _$jscoverage_done("lib/object-emitter.js", 710, xxTree["*"]._listeners)) {
                                _$jscoverage_done("lib/object-emitter.js", 711);
                                this.searchListenerTree(handlers, type, xxTree["*"], typeLength);
                            }
                        }
                    }
                }
                _$jscoverage_done("lib/object-emitter.js", 715);
                return listeners;
            },
            writable: true,
            configurable: true,
            enumerable: true
        }
    });
    _$jscoverage_done("lib/object-emitter.js", 729);
    ObjectEmitter.defineConstructor(function create(options) {
        _$jscoverage_done("lib/object-emitter.js", 730);
        var Instance = this;
        _$jscoverage_done("lib/object-emitter.js", 732);
        Instance.properties({
            _events: {
                value: {},
                enumerable: false
            }
        });
        _$jscoverage_done("lib/object-emitter.js", 740);
        if (_$jscoverage_done("lib/object-emitter.js", 740, "function" === typeof this.get) && _$jscoverage_done("lib/object-emitter.js", 740, this._meta) && _$jscoverage_done("lib/object-emitter.js", 740, Instance.get("usingDomains"))) {
            _$jscoverage_done("lib/object-emitter.js", 741);
            domain = domain || require("domain");
            _$jscoverage_done("lib/object-emitter.js", 742);
            if (_$jscoverage_done("lib/object-emitter.js", 742, domain.active) && _$jscoverage_done("lib/object-emitter.js", 742, !(Instance instanceof domain.Domain))) {
                _$jscoverage_done("lib/object-emitter.js", 744);
                Instance.properties({
                    domain: {
                        value: domain.active,
                        enumerable: false
                    }
                });
            }
        }
        _$jscoverage_done("lib/object-emitter.js", 754);
        return Instance;
    });
});
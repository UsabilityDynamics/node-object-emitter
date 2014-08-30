/**
 * Object Channels API
 *
 * mocha test/api.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 7/11/13
 * @type {Object}
 */
module.exports = {

  before: function() {
    module.Emitter = require( '../../.' );
    module.Settings = require( 'object-settings' );
  },

  'Object Emitter integration': {

    'with object-settings': function( done ) {

      var _instance;

      module.Settings.mixin( _instance = {} );

      _instance.set({
        'name': 'Andy',
        'vehicle': 'Tahoe',
        'tags': []
      });

      _instance.set({
        'tags': [ 'one', 'two' ]
      });

      module.Emitter.mixin( _instance )
        .once( 'usa:*:red', done  )
        .emit( 'usa:alabama:blue', null )
        .emit( 'usa:california:red', null )
        .emit( 'usa:california:green', null )
        .emit( 'usa:minnesota:black', null )

    }

  }

};
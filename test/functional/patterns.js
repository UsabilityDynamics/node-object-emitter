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
  },

  'Object Emitter patterns': {

    'can match wildcards': function( done ) {

      var _emitter = module.Emitter.create({ wildcard: true })
        .once( 'usa:*:red', done  )
        .emit( 'usa:alabama:blue', null )
        .emit( 'usa:california:red', null )
        .emit( 'usa:california:green', null )
        .emit( 'usa:minnesota:black', null )

    },

    'can match all with ** pattern': function( done ) {

      var _emitter = module.Emitter.create({ wildcard: true })
        .once( '**', done  )
        .emit( 'usa:minnesota:black', null )

    },

    'can match all with # pattern': function( done ) {

      var _emitter = module.Emitter.create({ wildcard: true })
        .once( '#', done  )
        .emit( 'usa:minnesota:black', null )

    },

    'can chose to throwErrors.': function( done ) {

      module.Emitter.create({ wildcard: true, throwErrors: false })
        .once( 'ping', done  )
        .emit( 'error', new Error( 'sadfadf' ) )
        .emit( 'ping', null )

    }

  }

};
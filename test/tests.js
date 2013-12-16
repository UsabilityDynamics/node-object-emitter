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

  'Object Emitter': {

    'can bind to a function': function( done ) {
      var emitter = require( '../' );

      function target() {}

      emitter.mixin( target );

      // target should now have EE properties
      target.should.have.property( 'on' );
      target.should.have.property( 'off' );
      target.should.have.property( '_events' );

      target.on( 'ping', done ).emit( 'ping', null );

    }

  }

};
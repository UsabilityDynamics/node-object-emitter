/**
 * Object Channels API
 *
 * mocha test/stream.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 7/11/13
 * @type {Object}
 */
module.exports = {

  before: function() {
    module.noop = function() {}
  },

  'Object Channels API': {

    'has Stream methods': function() {
      var channels = require( '../' );

      // Inherited from Stream
      channels.should.have.property( 'pause' );
      channels.should.have.property( 'resume' );
      channels.should.have.property( 'write' );
      channels.should.have.property( 'end' );

    }

  }

};
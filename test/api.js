/**
 * Object States API
 *
 * mocha test/api.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 7/11/13
 * @type {Object}
 */
module.exports = {

  /**
   * Prepare Environment
   *
   */
  'before': function() {

    // Dependancies
    require( 'should' );

  },

  'object-states': {

    'has expected methods': function() {
      var states = require( 'object-states' );

      states.should.have.property( 'create' );
      states.should.have.property( 'prototype' );
      states.should.have.property( 'utility' );

    }

  },

  /**
   * Destroy Environment
   *
   */
  'after': function() {
  }

};
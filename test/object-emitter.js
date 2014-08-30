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

    api: require( './unit/api' ),

    tests: require( './unit/tests' ),

    patterns: require( './functional/patterns' ),

    patterns: require( './integration/object-settings' ),

  }

};
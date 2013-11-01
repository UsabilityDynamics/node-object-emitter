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
    module.noop = function() {}
  },

  'Object Emitter API': {

    'has expected methods': function() {
      var ObjectEmitter = require( '../' );

      //console.log( 'typeof', typeof ObjectEmitter.should );

      // Constructor tests
      ObjectEmitter.should.have.property( 'prototype' );

      // Inherited Abstract methods
      ObjectEmitter.should.have.property( 'create' );
      ObjectEmitter.should.have.property( 'use' );
      ObjectEmitter.should.have.property( 'get' );
      ObjectEmitter.should.have.property( 'set' );
      ObjectEmitter.prototype.should.have.property( 'mixin' );
      ObjectEmitter.prototype.should.have.property( 'use' );

      // Prototypal Methods
      ObjectEmitter.prototype.should.have.property( 'on' );

    },

    'can be instantiated via create() method.': function() {
      var instance = require( '../' ).create();

      instance.should.have.property( 'mixin' );
      instance.should.have.property( 'on' );
      instance.should.have.property( 'off' );
      instance.should.have.property( 'emit' );

    },

    'on() method is chainable.': function() {
      //require( '../' ).create().on( 'noop', console.log ).should.have.property( 'emit' );
    },

    'off() method is chainable.': function() {
      //require( '../' ).create().off( 'noop', module.noop ).should.have.property( 'emit' );
    },

    'emit() method is chainable.': function() {
      //require( '../' ).create().emit( 'noop', module.noop ).should.have.property( 'emit' );
    },

    'emit() method works.': function( done ) {
      return done();

      require( '../' ).create().on( 'ping', function( data ) {
        data.should.equal( 'ding' );
        this.should.have.property( 'event', 'ping' );
        done()
      }).emit( 'ping', 'ding' );

    }

  }

};
###*
* Object Channels
*
* Create EventEmitter channels.
*
* @module object-channel
* @author potanin@UD
* @constructor
###
require( 'abstract' ).createModel ( model, prototype ) ->

  # Set Model Defaults
  model.set 'defaults':
    delimiter: '.'
    wildcard: true
    maxListeners: 20

  # Constructor Properties
  model.properties
    defaults: require( 'abstract' ).utility.noop
    noop: require( 'abstract' ).utility.noop

  # Instance Properties
  model.properties prototype,
    emit: require( 'eventemitter2' ).EventEmitter2.prototype.emit
    on: require( 'eventemitter2' ).EventEmitter2.prototype.on
    off: require( 'eventemitter2' ).EventEmitter2.prototype.off
    onAny: require( 'eventemitter2' ).EventEmitter2.prototype.onAny

    # Future Prototypal Methods
    subscribe: require( 'abstract' ).utility.noop
    unsubscribe: require( 'abstract' ).utility.noop

  # Instantiation Handler
  model.defineInstance ( config ) ->

    # @todo Add namespace check; if namespace is set, attempt to next listener tree.
    # @todo Add default settings use, if configured for model.

    # Define instance settings
    @listenerTree = {}
    @wildcard = model.get 'defaults.wildcard'
    @maxListeners = model.get 'defaults.maxListeners'
    @delimiter = model.get 'defaults.delimiter'

    # Set Emitter meta
    @set 'emitter', config

  # Export Abstrat Model as the module
  module.exports = model

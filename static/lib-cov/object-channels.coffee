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

  # Include Settings
  model.use require( 'eventemitter2' ).prototype

  # Constructor Properties
  model.properties
    noop: require( 'abstract' ).utility.noop

  # Instance Properties
  model.properties @prototype,
    noop: require( 'abstract' ).utility.noop

  # Instantiation Handler
  model.defineInstance ( config ) ->

    # Set Options
    @set config

  # Export Abstrat Model as the module
  module.exports = model

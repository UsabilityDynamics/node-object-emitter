## Overview
Object Emitter adds Event Emitter functionality to an object, creates a new emitter, or can be used to override an existing object's emitter methods.
This is similar to the awesome EventEmitter2 module since there is wildcard support.

  - Convenience "mixin" method for easily adding Emitter to any object.
  - All module methods (on, emit, off, etc) are chainable.
  - Wildcard matching enabled by default.
  - Extends existing EventEmitters by working with the _events property.
  - Recognizes Node.js domain usage.
  - Allows default "error" callback to avoid throwing "unspecified 'error' event" error.

## Constructor Methods

 - create: Create a new instance of Object Emitter.
 - mixin: Add Object Emitter properties into a target object, never overwriting any existing properties.
 - inject: Force-add Object Emitter properties into the target, overwriting any existing properties if necessary.

## Basic Usage
Create new instance of Object Emitter.

    require( 'object-emitter' )
      .create({ delimiter: ':' })
      .on( '*:two', console.log )
      .emit( 'ping:one', 'I am ignored.' );  
      .emit( 'ping:two', 'I am not ignored!' );  

Add Object Emitter to a new object.

    var MyObject = {};
    
    require( 'object-emitter' ).mixin( MyObject );    
    
    MyObject
      .on( 'ping', console.log )
      .emit( 'ping', 'Chaining works!' );
    
Extend existing EventEmitter object and utilize wildcards.

    require( 'object-emitter' ).mixin( process );    
    process.on( '*.ping', console.log );
    process.emit( 'ding', 'I am ignored.' );
    process.emit( 'ding.ping', 'I am not ignored!' );

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

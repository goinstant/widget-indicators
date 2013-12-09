/*jshint browser:true*/
/*global module*/

'use strict';

/**
 * Expose the module
 */
var errors = module.exports = function errors() {};

var errorMap = {
  INVALID_ARGUMENT: ': Invalid argument passed',
  INVALID_WIDGET_ELEMENT: ': Widget element option must be a HTML element',
  INVALID_BLINK_ELEMENT: ': Blink element option must be a HTML element',
  INVALID_WINDOW_BLINK: ': Window blink option must be a boolean',
  INVALID_PLAY_SOUND: ': Play sound option must be a boolean',
  INVALID_SOUND_URLS: ': Sound URLs option just be an object with \'mp3\' and \'ogg\' keys',
  INVALID_ENABLED: ': Enabled option must be a boolean',
  MISSING_BLINK_ELEMENT: ': Must pass a blink element option when passing a widget element option',
  MISSING_WIDGET_ELEMENT: ': Must pass a widget element option when passing a blink element option'
};

errors.create = function(method, type) {
  if (!method || !type || !errorMap[type]) {
    throw new Error('That error type doesn\'t exist!');
  }

  return new Error(method + '' + errorMap[type]);
};

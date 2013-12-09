/*jshint browser:true*/
/*global module, require*/

'use strict';

/**
 * @fileoverview
 * Creates various indicators when the widget is not in focus.
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var binder = require('binder');
var classes = require('classes');

var errors = require('./errors');

/**
 * @const
 */
var VALID_OPTIONS = [
  'widgetElement',
  'blinkElement',
  'windowBlink',
  'playSound',
  'soundUrls',
  'enabled'
];

var BLINK_CLASS = 'gi-widget-blink';

var DEFAULT_OPTIONS = {
  widgetElement: null,
  blinkElement: null,
  windowBlink: true,
  playSound: true,
  soundUrls: {
    mp3: 'sounds/gi-widget-pop.mp3',
    ogg: 'sounds/gi-widget-pop.ogg'
  },
  enabled: true
};

/**
 * Export the module
 */
module.exports = WidgetIndicators;

/**
 * @constructor
 */
function WidgetIndicators(options) {
  options = options || {};

  var name = 'Widget Indicators';

  var optionsPassed = _.keys(options);
  var optionsDifference = _.difference(optionsPassed, VALID_OPTIONS);

  if (optionsDifference.length) {
    throw errors.create(name, 'INVALID_ARGUMENT');
  }

  if (options.widgetElement && !_.isElement(options.widgetElement)) {
    throw errors.create(name, 'INVALID_WIDGET_ELEMENT');
  }

  if (options.blinkElement && !_.isElement(options.blinkElement)) {
    throw errors.create(name, 'INVALID_BLINK_ELEMENT');
  }

  if (options.windowBlink && !_.isBoolean(options.windowBlink)) {
    throw errors.create(name, 'INVALID_WINDOW_BLINK');
  }

  if (options.playSound && !_.isBoolean(options.playSound)) {
    throw errors.create(name, 'INVALID_PLAY_SOUND');
  }

  if (options.soundUrls && !_.isObject(options.soundUrl)) {
    throw errors.create(name, 'INVALID_SOUND_URLS');
  }

  if (options.enabled && !_.isBoolean(options.enabled)) {
    throw errors.create(name, 'INVALID_ENABLED');
  }

  if (options.widgetElement && !options.blinkElement) {
    throw errors.create(name, 'MISSING_BLINK_ELEMENT');
  }

  if (options.blinkElement && !options.widgetElement) {
    throw errors.create(name, 'MISSING_WIDGET_ELEMENT');
  }

  var validatedOptions = _.defaults(options, DEFAULT_OPTIONS);

  this._binder = binder;

  this._widgetEl = validatedOptions.widgetElement;
  this._blinkEl = validatedOptions.blinkElement;

  this._opts = {
    windowBlink: validatedOptions.windowBlink,
    playSound: validatedOptions.playSound
  };

  this._soundUrls = validatedOptions.soundUrls;

  this._widgetFocused = false;

  this._widgetIsBound = false;

  this._windowBlinkId = null;
  this._widgetBlinkId = null;

  this._audioEl = null;

  _.bindAll(this, [
    '_widgetFocus',
    '_widgetBlur'
  ]);

  this._enabled = validatedOptions.enabled;

  if (this._enabled) {
    this.enable();
  }
}

WidgetIndicators.prototype.enable = function() {
  this._createAudioEl();
  this._bindDom();

  this._enabled = true;
};

WidgetIndicators.prototype._createAudioEl = function() {
  // Unsupported HTML 5 audio element (IE8)
  if (!window.Audio) {
    this._opts.playSound = false; // Override playSound option for unsupported
    return;
  }

  // Fixes SauceLabs IE9 audio source loading issue "Error: Not implemented"
  try {
    this._audioEl = new Audio();

  } catch(err) {
    // Override playSound option if audio creation fails
    this._opts.playAudio = false;

    return;
  }

  var source1 = document.createElement('source');
  var source2 = document.createElement('source');
  var embed = document.createElement('embed');

  source1.type = 'audio/mpeg';
  source1.src = this._soundUrls.mp3;

  source2.type = 'audio/audio/ogg';
  source2.src = this._soundUrls.ogg; // mp3 unsupported in legacy FF

  this._audioEl.appendChild(source1);
  this._audioEl.appendChild(source1);
};

WidgetIndicators.prototype._bindDom = function() {
  // TODO: allow for multiple elements to be considered the widget's 'focus'
  if (this._widgetEl && !this._widgetIsBound) {
    this._binder.on(this._widgetEl, 'focus', this._widgetFocus);
    this._binder.on(this._widgetEl, 'blur', this._widgetBlur);

    this._widgetIsBound = true;
  }
};

WidgetIndicators.prototype._widgetFocus = function() {
  this._widgetFocused = true;
};

WidgetIndicators.prototype._widgetBlur = function() {
  this._widgetFocused = false;
};

WidgetIndicators.prototype.trigger = function(text) {
  if (!this._enabled) {
    return;
  }

  if (text) {
    this._windowBlink(text);
  }

  this._widgetBlink();

  this._playSound();
};

WidgetIndicators.prototype._playSound = function() {
  if (!this._opts.playSound || !this._audioEl) {
    return;
  }

  if (document.hasFocus() && this._widgetFocused) {
    return;
  }

  this._audioEl.play();
};

WidgetIndicators.prototype._windowBlink = function(text) {
  if (!this._opts.windowBlink) {
    return;
  }

  if (document.hasFocus()) {
    return;
  }

  if (!text) {
    return errors.create('Widget Indicators', 'WINDOW_BLINK_TEXT');
  }

  // Already blinking the window, don't blink again
  if (this._windowBlinkId) {
    return;
  }

  var originalTitle = document.title;

  document.title = text;

  var blink = true;

  var self = this;

  this._windowBlinkId = window.setInterval(function() {
    // Cancel blink when window gains focus
    if (text && document.hasFocus()) {
      window.clearInterval(self._windowBlinkId);
      self._windowBlinkId = null;

      document.title = originalTitle;

      return;
    }

    document.title = (blink) ? originalTitle : text;

    blink = !blink;
  }, 1000);
};

WidgetIndicators.prototype._widgetBlink = function() {
  if (!this._widgetEl) {
    return;
  }

  if (this._widgetFocused) {
    return;
  }

  // Already blinking the widget, don't blink again
  if (this._widgetBlinkId) {
    return;
  }

  classes(this._blinkEl).add(BLINK_CLASS);

  var blink = true;

  var self = this;

  this._widgetBlinkId = window.setInterval(function() {
    // cancel widgetBlink when widget gains focus
    if (self._widgetFocused) {
      window.clearInterval(self._widgetBlinkId);
      self._widgetBlinkId = null;

      classes(self._blinkEl).remove(BLINK_CLASS);

      return;
    }

    if (!blink) {
      classes(self._blinkEl).add(BLINK_CLASS);

    } else {
      classes(self._blinkEl).remove(BLINK_CLASS);
    }

    blink = !blink;
  }, 1000);
};

WidgetIndicators.prototype._unbindDom = function() {
  if (this._widgetBlink && this._windowIsBound && this._widgetEl) {
    this._binder.on(this._widgetEl, 'focus', this._widgetFocus);
    this._binder.on(this._widgetEl, 'blur', this._widgetBlur);

    this._widgetIsBound = false;
  }
};

WidgetIndicators.prototype.disable = function() {
  this._audioEl = null;
  this._unbindDom();

  this._enabled = false;
};

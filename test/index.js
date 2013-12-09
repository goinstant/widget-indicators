/*jshint browser:true, node:false*/
/*global require, sinon*/

describe('Widget Indicators', function() {
  "use strict";

  var WidgetIndicators = require('widget-indicators');

  var assert = window.assert;
  var sinon = window.sinon;

  var _ = window._;
  var $ = require('jquery');

  var testWidgetIndicators;

  describe('errors', function() {
    it('throws an error if invalid options argument is passed', function() {
      var fakeOptions = {
        test: 'test'
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Invalid argument passed');
    });

    it('throws an error if invalid widget element is passed', function() {
      var fakeOptions = {
        widgetElement: 'test'
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Widget element option must be a HTML element');
    });

    it('throws an error if invalid blink element is passed', function() {
      var fakeOptions = {
        blinkElement: 'test'
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Blink element option must be a HTML element');
    });

    it('throws an error if invalid window blink option is passed', function() {
      var fakeOptions = {
        windowBlink: 'test'
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Window blink option must be a boolean');
    });

    it('throws an error if invalid play sound option is passed', function() {
      var fakeOptions = {
        playSound: 'test'
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Play sound option must be a boolean');
    });

    it('throws an error if invalid sound URLs option is passed', function() {
      var fakeOptions = {
        soundUrls: 'test'
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Sound URLs option just be an object with \'mp3\' and \'ogg\' keys');
    });

    it('throws an error if invalid enabled option is passed', function() {
      var fakeOptions = {
        enabled: 'test'
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Enabled option must be a boolean');
    });

    it('throws an error if missing a required blink element', function() {
      var fakeOptions = {
        widgetElement: document.createElement('div')
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Must pass a blink element option when passing a widget element option');
    });

    it('throws an error if missing a required widget element', function() {
      var fakeOptions = {
        blinkElement: document.createElement('div')
      };

      assert.exception(function() {
        testWidgetIndicators = new WidgetIndicators(fakeOptions);
      }, 'Widget Indicators: Must pass a widget element option when passing a blink element option');
    });
  });

  describe('constructor', function() {
    beforeEach(function() {
      testWidgetIndicators = new WidgetIndicators();
    });

    afterEach(function() {
      testWidgetIndicators.disable();
    });

    it('creates a new instance of the WidgetIndicators widget', function() {
      assert(testWidgetIndicators instanceof WidgetIndicators);
    });
  });

  describe('enable', function() {
    var options;

    beforeEach(function() {
      options = {
        widgetElement: document.createElement('div'),
        blinkElement: document.createElement('div')
      };

      testWidgetIndicators = new WidgetIndicators(options);
    });

    afterEach(function() {
      testWidgetIndicators.disable();
    });

    it('creates an Audio element if supported' ,function () {
      if (!window.Audio || !testWidgetIndicators._audioEl) {
        assert.isNull(testWidgetIndicators._audioEl);
        return;
      }

      assert.isNotNull(testWidgetIndicators._audioEl);
    });

    it('binds to the DOM', function() {
      var options = {
        widgetElement: document.createElement('div'),
        blinkElement: document.createElement('div')
      };

      testWidgetIndicators = new WidgetIndicators(options);
      sinon.spy(testWidgetIndicators._binder, 'on');

      var binder = testWidgetIndicators._binder;
      binder.on.calledWith(
        binder.on,
        options.widgetElement,
        'focus',
        testWidgetIndicators._widgetFocus
      );

      binder.on.calledWith(
        binder.on,
        options.widgetElement,
        'blur',
        testWidgetIndicators._widgetblur
      );
    });
  });

  describe('disable', function() {
    var options;

    beforeEach(function() {
      options = {
        widgetElement: document.createElement('div'),
        blinkElement: document.createElement('div')
      };

      testWidgetIndicators = new WidgetIndicators(options);
    });

    it('unbinds to the DOM', function() {
      sinon.spy(testWidgetIndicators._binder, 'off');

      var binder = testWidgetIndicators._binder;
      binder.off.calledWith(
        binder.on,
        options.widgetElement,
        'focus',
        testWidgetIndicators._widgetFocus
      );

      binder.off.calledWith(
        binder.on,
        options.widgetElement,
        'blur',
        testWidgetIndicators._widgetblur
      );
    });
  });

  describe('trigger', function() {
    var wEl = document.createElement('input');
    var bEl = document.createElement('div');

    afterEach(function() {
      testWidgetIndicators.disable();
    });

    it('triggers a sound, window blink, and widget blink', function() {
      var options = {
        widgetElement: wEl,
        blinkElement: bEl
      };

      testWidgetIndicators = new WidgetIndicators(options);

      document.hasFocus = sinon.stub().returns(false);

      sinon.spy(testWidgetIndicators, '_windowBlink');
      sinon.spy(testWidgetIndicators, '_widgetBlink');
      sinon.spy(testWidgetIndicators, '_playSound');

      var fakeText = 'test text';
      testWidgetIndicators.trigger(fakeText);

      testWidgetIndicators._windowBlink.calledWith(fakeText);
      sinon.assert.calledOnce(testWidgetIndicators._widgetBlink);
      sinon.assert.calledOnce(testWidgetIndicators._playSound);

      assert.isNotNull(testWidgetIndicators._windowBlinkId);
      assert.isNotNull(testWidgetIndicators._widgetBlinkId);
    });

    it('does not trigger a sound if option is false', function() {
      var options = {
        playSound: false
      };

      testWidgetIndicators = new WidgetIndicators(options);

      // Handle test differently for unsupported browsers (IE8)
      if (window.Audio && testWidgetIndicators._audioEl) {
        sinon.spy(testWidgetIndicators._audioEl, 'play');
      }

      testWidgetIndicators.trigger();

      if (window.Audio && testWidgetIndicators._audioEl) {
        sinon.assert.notCalled(testWidgetIndicators._audioEl.play);

      } else {
        assert.isNull(testWidgetIndicators._audioEl);
      }
    });

    it('does not trigger a window blink if text is not passed', function() {
      testWidgetIndicators = new WidgetIndicators();

      testWidgetIndicators.trigger(null);

      assert.isNull(testWidgetIndicators._windowBlinkId);
    });

    it('does not trigger a window blink if window already focused', function() {
      testWidgetIndicators = new WidgetIndicators();

      document.hasFocus = sinon.stub().returns(true);

      testWidgetIndicators.trigger('test text');

      assert.isNull(testWidgetIndicators._windowBlinkId);
    });

    it('does not trigger a window blink if option is false', function() {
      var options = {
        windowBlink: false
      };

      testWidgetIndicators = new WidgetIndicators(options);

      testWidgetIndicators.trigger('test text');

      assert.isNull(testWidgetIndicators._windowBlinkId);
    });

    it('does not trigger a widget blink if already focused', function() {
      var options = {
        widgetElement: wEl,
        blinkElement: bEl
      };

      testWidgetIndicators = new WidgetIndicators(options);
      testWidgetIndicators._widgetFocused = true;

      testWidgetIndicators.trigger();

      assert.isNull(testWidgetIndicators._widgetBlinkId);
    });

    it('does not trigger a widget blink if widget el not passed', function() {
      testWidgetIndicators = new WidgetIndicators();

      testWidgetIndicators.trigger();

      assert.isNull(testWidgetIndicators._widgetBlinkId);
    });

    it('does not trigger another window blink if already blinking', function() {
      testWidgetIndicators = new WidgetIndicators();

      testWidgetIndicators.trigger('test text');

      var blinkId = testWidgetIndicators._windowBlinkId;

      for (var i = 0; i < 10; i++) {
        testWidgetIndicators.trigger('test text');
      }

      assert.equal(testWidgetIndicators._windowBlinkId, blinkId);
    });

    it('does not trigger another widget blink if already blinking', function() {
      testWidgetIndicators = new WidgetIndicators();

      testWidgetIndicators.trigger();

      var blinkId = testWidgetIndicators._widgetBlinkId;

      for (var i = 0; i < 10; i++) {
        testWidgetIndicators.trigger('test text');
      }

      assert.equal(testWidgetIndicators._widgetBlinkId, blinkId);
    });

    it('does not trigger if disabled', function() {
      var options = {
        widgetElement: wEl,
        blinkElement: bEl,
        enabled: false
      };

      testWidgetIndicators = new WidgetIndicators(options);

      sinon.spy(testWidgetIndicators, '_windowBlink');
      sinon.spy(testWidgetIndicators, '_widgetBlink');
      sinon.spy(testWidgetIndicators, '_playSound');

      testWidgetIndicators.trigger('test text');

      sinon.assert.notCalled(testWidgetIndicators._windowBlink);
      sinon.assert.notCalled(testWidgetIndicators._widgetBlink);
      sinon.assert.notCalled(testWidgetIndicators._playSound);
    });

    it('cancels the window blink when window regains focus', function() {
      testWidgetIndicators = new WidgetIndicators();

      var clock = sinon.useFakeTimers();
      document.hasFocus = sinon.stub().returns(false);

      testWidgetIndicators.trigger('test text');

      assert.isNotNull(testWidgetIndicators._windowBlinkId);

      document.hasFocus = sinon.stub().returns(true);

      clock.tick(1500);

      assert.isNull(testWidgetIndicators._windowBlinkId);
    });

    it('restores the title and widget class when blink canceled', function() {
      var fakeTitle = 'Test Title';
      document.title = fakeTitle;

      var fakeClass = 'test-class';
      bEl.className = fakeClass;

      var options = {
        widgetElement: wEl,
        blinkElement: bEl
      };

      testWidgetIndicators = new WidgetIndicators(options);

      var clock = sinon.useFakeTimers();
      document.hasFocus = sinon.stub().returns(false);

      var fakeText = 'test text';
      testWidgetIndicators.trigger(fakeText);

      assert.equal(document.title, fakeText);
      assert.equal(bEl.className, fakeClass + ' gi-widget-blink');

      clock.tick(5000);

      document.hasFocus = sinon.stub().returns(true);
      testWidgetIndicators._widgetFocused = true;

      clock.tick(1500);

      assert.isNull(testWidgetIndicators._windowBlinkId);
      assert.isNull(testWidgetIndicators._widgetBlinkId);

      assert.equal(document.title, fakeTitle);
      assert.equal(bEl.className, fakeClass);
    });
  });
});

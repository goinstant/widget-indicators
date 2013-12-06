/*jshint browser:true, node:false*/
/*global require, sinon*/

describe('Widget Indicators', function() {
  "use strict";

  var WidgetIndicators = require('widget-indicators');

  var assert = window.assert;
  var sinon = window.sinon;

  var _ = window._;

  describe('Constructor', function() {
    var widgetIndicators;

    beforeEach(function(done) {
      widgetIndicators = new WidgetIndicators();
      widgetIndicators.initialize(done);
    });

    afterEach(function(done) {
      widgetIndicators.destroy(done);
    });

    it('creates a new instance of the WidgetIndicators widget', function() {
      assert(widgetIndicators instanceof WidgetIndicators);
    });
  });
});

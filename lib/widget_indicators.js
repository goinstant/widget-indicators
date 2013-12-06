/*jshint browser:true*/
/*global module, require*/
'use strict';

/**
 * @fileoverview
 *
 */

/** Module dependencies */


/** Constants */

/**
 * @constructor
 */
function WidgetIndicators() {

}

/**
 * Initializes the WidgetIndicators widget
 * @public
 * @param {function} cb The function to call with an error or when
 *                      initialization is complete.
 */
WidgetIndicators.prototype.initialize = function(cb) {
  cb();
};

/**
 * Destroys the WidgetIndicators widget
 * @public
 * @param {function} cb The function to call with an error or when
 *                      the destroy is complete.
 */
WidgetIndicators.prototype.destroy = function(cb) {
  cb();
};

/* Export the module */
module.exports = WidgetIndicators;

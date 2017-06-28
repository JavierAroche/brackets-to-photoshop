/*
 * brackets-to-photoshop (Brackets extension)
 *
 * Windows File System Module
 * Author: Javier Aroche
 *
 */

;(function () {

	'use strict';

	var fs = require('fs');
	var path = require('path');

	/*
	 * Windows File System constructor.
	 *
	 * @constructor
	 */
	function WindowsFS() {}

	/*
	 * @private
	 * Function to validate if target application exists in user's system
	 * @param {string} path to current jsx document.
	 * @return {string} Successful string to display in console.
	 */
	WindowsFS.prototype._validateTargetApplication = function (application, applicationVersion) {
		try {
			// Check that Application's folder exists
			var appPath = path.join('Program Files', 'Adobe', applicationVersion);
			fs.statSync(appPath + '/' + application + '.exe').isFile();
			console.info('Br-Ps: PSVersion: Running ' + applicationVersion);
			return true;
		} catch (err) {
			return false;
		}
	}

	/*
	 * @private
	 * Function to identify latest application version
	 * @param {string} application versions
	 * @return {string} Latest application version
	 */
	WindowsFS.prototype._identifyLatestApplicationVersion = function (application, applicationVersions) {
		var self = this;
		var foundApplicationVersion = false;

		// Iterate through object keys ( versions )
		for (var key in applicationVersions) {
			if (Object.prototype.hasOwnProperty.call(applicationVersions, key)) {
				// Check that Application's folder exists
				if (self._validateTargetApplication(application, applicationVersions[key])) {
					var appPath = path.join('Program Files', 'Adobe', applicationVersions[key]);
					var applicationVersion = applicationVersions[key];

					foundApplicationVersion = true;
					return applicationVersion;
				}
			}
		}

		// No version was found
		if (!foundApplicationVersion) {
			return false;
		}
	}

	module.exports = WindowsFS;
}());

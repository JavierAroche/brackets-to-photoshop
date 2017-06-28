/*
 * brackets-to-photoshop (Brackets extension)
 *
 * MacOS File System Module
 * Author: Javier Aroche
 *
 */

;(function () {

	'use strict';

	var fs = require('fs');

	/*
	 * MacOS File System constructor.
	 *
	 * @constructor
	 */
	function MacOSFS() {}

	/*
	 * @private
	 * Function to validate if target application exists in user's system
	 * @param {string} path to current jsx document.
	 * @return {string} Successful string to display in console.
	 */
	MacOSFS.prototype._validateTargetApplication = function (application, applicationVersion) {
		try {
			// Check that Application's folder exists
			fs.statSync('/Applications/' + applicationVersion).isFile();
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
	MacOSFS.prototype._identifyLatestApplicationVersion = function (application, applicationVersions) {
		var self = this;
		var foundApplicationVersion = false;

		// Iterate through object keys ( versions )
		for (var key in applicationVersions) {
			if (Object.prototype.hasOwnProperty.call(applicationVersions, key)) {
				// Check that Application's folder exists
				if (self._validateTargetApplication(application, applicationVersions[key])) {
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

	module.exports = MacOSFS;
}());

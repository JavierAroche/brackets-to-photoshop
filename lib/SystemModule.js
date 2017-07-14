/*
 * brackets-to-photoshop (Brackets extension)
 *
 * System Module
 * Author: Javier Aroche
 *
 */

;(function () {

	'use strict';

	var path = require('path');
	var exec = require('child_process').exec;

	var FileModule = require('./FileModule');

	/*
	 * System constructor.
	 *
	 * @constructor
	 */
	function SystemModule() {
		this.fileModule = new FileModule();
	}

	/*
	 * @private
	 * Handler function to run a JSX on MacOS, through osascript.
	 * @param {string} targetApplication to identify app command.
	 * @param {string} targetApplicationVersion to execute script in.
	 * @param {string} pathToJSX to execute
	 */
	SystemModule.prototype._runJSXInMacOS = function (application, pathToJSX) {
		var include = this._getInclude(pathToJSX);
		var appCommands = this._getApplicationCommands(application.app);
		var commandToExecute = "osascript -e 'with timeout of 2592000 seconds" + "\n" + "tell application \"" + application.version + "\" to " + appCommands.command + " (\"" + include + "\") " + appCommands.language + "\n" + "end timeout'";

		this._runJSX(commandToExecute);
	}

	/*
	 * @private
	 * Handler function to run a JSX on Windows.
	 * @param {string} targetApplication to identify app command.
	 * @param {string} targetApplicationVersion to execute script in.
	 * @param {string} pathToJSX to execute
	 */
	SystemModule.prototype._runJSXInWindows = function (application, pathToJSX) {
		var include = this._getInclude(pathToJSX);
		var scriptFile = this.fileModule._saveToScriptFile(include);
		var commandToExecute = 'open -a \"' + application.version + '\" \"' + scriptFile + '\"';

		this._runJSX(commandToExecute);
	};

	/*
	 * @private
	 * Handler function to determine the correct command to execute, depending on the target application
	 * @param {string} targetApplication
	 * @return {string} Successful string to display in console.
	 */
	SystemModule.prototype._runJSX = function (commandToExecute) {
		var self = this;
		var initialExecutionTime = new Date().getTime();

		exec(commandToExecute, {
			maxBuffer: 1024 * 100000
		}, function (error, stdout, stderr) {
			// Send execution time to console
			var finalExecutionTime = new Date().getTime();
			var executionTime = (finalExecutionTime - initialExecutionTime) * 0.001;

			console.log('Br-Ps: ExecutionTime: Execution Time: ' + executionTime.toFixed(3) + ' seconds');

			self.fileModule._readLogFile();

			if (error) {
				console.error('Br-Ps: ' + stderr.toString().split('->')[0]);
			}

			if (stdout) {
				// Log the result, mimicking ExtendScript's 'Result' log
				console.log('Br-Ps: Result: ' + stdout);
			}

			self.fileModule._clearLogFile();
			self.fileModule._saveTmpFile('');
			self.fileModule._saveToScriptFile('');
		});
	};

	/*
	 * @private
	 * Handler function to determine the correct command to execute, depending on the target application
	 * @return {string} Successful string to display in console.
	 */
	SystemModule.prototype._getInclude = function (pathToJSX) {
		// Set #include paths
		var pathToJSXInclude = "#include '" + encodeURI(pathToJSX) + "'";
		var pathToHelpers = path.resolve(__dirname, '../jsx/Helpers.jsx');
		var pathToHelpersInclude = "#include '" + encodeURI(pathToHelpers) + "'";

		return '\n' + pathToHelpersInclude + '\n' + pathToJSXInclude;
	};

	/*
	 * @private
	 * Handler function to determine the correct command to execute, depending on the target application
	 * @param {string} targetApplication
	 * @return {string} Successful string to display in console.
	 */
	SystemModule.prototype._getApplicationCommands = function (targetApplication) {
		var appCommands = {};

		switch (targetApplication) {
			case 'aftereffects':
				appCommands.command = 'DoScript';
				appCommands.language = '';
				break;

			case 'indesign':
				appCommands.command = 'do script';
				appCommands.language = 'language javascript';
				break;

			default:
				appCommands.command = 'do javascript';
				appCommands.language = '';
				break;
		}

		return appCommands;
	};

	module.exports = SystemModule;
}());

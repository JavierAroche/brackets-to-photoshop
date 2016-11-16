/*
 * brackets-to-photoshop (Brackets extension)
 *
 * Osascript Module
 * Author: Javier Aroche
 *
 */

(function() {

    'use strict';
    
    var path = require( 'path' );
    var exec = require('child_process').exec;

    var FileModule = require( './FileModule' );

    /*
     * Osa constructor.
     * 
     * @constructor
     */
    function OsascriptModule() {
        this.fileModule = new FileModule();
    }
    
    /*
     * @private
     * Handler function to run a JSX through osa.
     * @param {string} targetApplication to identify app command.
     * @param {string} targetApplicationVersion to execute script in.
     * @param {string} pathToJSX to execute
     */
    OsascriptModule.prototype._runJSX = function( targetApplication, targetApplicationVersion, pathToJSX ) {
        var self = this;

        // Set #include paths
        var pathToJSXInclude = "#include '" + encodeURI(pathToJSX) + "'";
        
        var pathToHelpers = path.resolve( __dirname, '../jsx/Helpers.jsx' );
        var pathToHelpersInclude = "#include '" + encodeURI(pathToHelpers) + "'";

        var appCommands = this._getApplicationCommands( targetApplication );

        var include = '\n' + pathToHelpersInclude + '\n' + pathToJSXInclude;

        // Set osascript command with a timeout of 1 month, just in case
        var commandToExecute = "osascript -e 'with timeout of 2592000 seconds" + "\n" + "tell application \"" + targetApplicationVersion + "\" to " +  appCommands.command + " (\"" + include +  "\") " +  appCommands.language + "\n" + "end timeout'";
		
        // Get initial execution time
        var initialExecutionTime = new Date().getTime();

        exec(commandToExecute, {maxBuffer: 1024 * 100000}, function(error, stdout, stderr) {
            // Send execution time to console
            var finalExecutionTime = new Date().getTime();
            var executionTime = ( finalExecutionTime - initialExecutionTime ) * 0.001;

            console.log( 'Br-Ps: ExecutionTime: Execution Time: ' + executionTime.toFixed(3) + ' seconds');

            self.fileModule._readLogFile();

            if( error ) {
                console.error( 'Br-Ps: ' + error.toString().split( '->' )[0] );
            }

            if( stdout ) {
                // Log the result, mimicking ExtendScript's 'Result' log
                console.log( 'Br-Ps: Result: ' + stdout );
            }

            self.fileModule._clearLogFile();
		});
    }

    /*
     * @private
     * Handler function to determine the correct command to execute, depending on the target application
     * @param {string} targetApplication
     * @return {string} Successful string to display in console.
     */
    OsascriptModule.prototype._getApplicationCommands = function( targetApplication ) {
        var appCommands = {};

        switch( targetApplication ) {
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

        console.log()

        return appCommands;
    }
    
    module.exports = OsascriptModule;
}());

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
	var osascript = require( 'node-osascript' );

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
        var pathToJSXInclude = "#include '" + pathToJSX + "'";
        
        var pathToHelpers = path.resolve( __dirname, '../jsx/Helpers.jsx' );
        var pathToHelpersInclude = "#include '" + pathToHelpers + "'";

        var appCommands = this._getApplicationCommands( targetApplication );

        var includes = '\n' + pathToHelpersInclude + '\n' + pathToJSXInclude;
        var commandToExecute = "with timeout of 99999 seconds" + "\n" + "tell application \"" + targetApplicationVersion + "\" to " +  appCommands.command + " (\"" + includes +  "\") " +  appCommands.language + "\n" + "end timeout";
		
        osascript.execute(commandToExecute , function(err, result, raw ) {
			self.fileModule._readLogFile();

           if ( err ) {
               // Filter JSON.stringify errors to not display the entire function in the console
               if( err.toString().indexOf( "if(typeof JSON!=='object')" ) !== -1 ) {
                   console.error( 'Br-Ps: ' + err.toString().split( '->' )[0] );
               } else {
                   console.error( 'Br-Ps: ' + err );
               }
           }

           if ( result ) { 
               // Log the result, mimicking ExtendScript's 'Result' log
               console.log( 'Br-Ps: Result: ' + result );
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

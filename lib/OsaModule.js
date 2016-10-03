/*
 * brackets-to-photoshop (Brackets extension)
 *
 * Osa Module
 * Author: Javier Aroche
 *
 */

(function() {

    'use strict';
    
    var path = require( 'path' );
    var osa  = require( 'osa' );

    var FileModule = require( './FileModule' );

    /*
     * Osa constructor.
     * 
     * @constructor
     */
    function OsaModule() {
        this.fileModule = new FileModule();
    }
    
    /*
     * @private
     * Handler function to run a JSX through osa.
     * @param {string} targetApplication to identify app command.
     * @param {string} targetApplicationVersion to execute script in.
     * @param {string} pathToJSX to execute
     */
    OsaModule.prototype._runJSX = function( targetApplication, targetApplicationVersion, pathToJSX ) {
        var self = this;

        // Set #include paths
        var pathToJSXInclude = "#include \"" + pathToJSX + "\"";
        
        var pathToHelpers = path.resolve( __dirname, '../jsx/Helpers.jsx' );
        var pathToHelpersInclude = "#include \"" + pathToHelpers + "\"";

        var command = this._setApplicationCommand( targetApplication );
        var commandToExecute = '\n' + pathToHelpersInclude + '\n' + pathToJSXInclude;

        osa(
            // Function to execute
            function( targetApplicationVersion, commandToExecute, command ) {
                return Application( targetApplicationVersion )[command]( commandToExecute, { language : 'javascript' } );
            },

            // Arguments
            targetApplicationVersion, commandToExecute, command,

            // Callback function
            function( err, result, log ) {
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
            }
        );
    }

    /*
     * @private
     * Handler function to determine the correct command to execute, depending on the target application
     * @param {string} targetApplication
     * @return {string} Successful string to display in console.
     */
    OsaModule.prototype._setApplicationCommand = function( targetApplication ) {
        var applicationCommand;

        switch( targetApplication ) {
            case 'aftereffects':
                applicationCommand = 'doscript';
                break;

            case 'indesign':
                applicationCommand = 'doScript';
                break;

            default:
                applicationCommand = 'doJavascript';
                break;
        }

        return applicationCommand;
    }
    
    module.exports = OsaModule;
}());

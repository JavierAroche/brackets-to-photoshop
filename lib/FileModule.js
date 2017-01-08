/*
 * brackets-to-photoshop (Brackets extension)
 *
 * File Module
 * Author: Javier Aroche
 *
 */

(function() {

    'use strict';
    
    var fs   = require( 'fs' );
    var path = require( 'path' );

    /*
     * File constructor.
     * 
     * @constructor
     */
    function FileModule() {}

    /*
     * @private
     * Function to identify the user's target application input
     * @return {string} Target application
     */
    FileModule.prototype._identifyTargetApplication = function( documentText ) {
        // Set RegExp to find #target
        var targetRegExp = /#target.+/g;
        var targetApplication = {
            app     : '',
            version : documentText.match(targetRegExp)
        }

        if ( targetApplication.version !== null ) {
            // Get the target application
            targetApplication.version = targetApplication.version[0].replace(/"/g, '').replace(/'/g, '');
            targetApplication.version = targetApplication.version.split('#target ')[1];
			targetApplication.version = targetApplication.version.replace(/[;\s]+/g, '');
            targetApplication.app = targetApplication.version.split('-')[0];
        }

        return targetApplication;
    }

    /*
     * @private
     * Function to save tmp file
     * @param {string} Text to be saved to tmp file.
     * @return {string} Path to tmp file.
     */
    FileModule.prototype._saveTmpFile = function( documentText ) {
        var tmpFile = path.resolve( __dirname, '../tmp/tmp.txt' );

        fs.writeFileSync( tmpFile, documentText );

        return tmpFile;
    }
	
    /*
     * @private
     * Function to save script file
     * @param {string} Script to be saved to script file.
     * @return {string} Path to script file.
     */
    FileModule.prototype._saveToScriptFile = function( script ) {
        var scriptFile = path.resolve( __dirname, '../tmp/script.jsx' );

        fs.writeFileSync( scriptFile, script );

        return scriptFile;
    }
    
    /*
     * @private
     * Function to read the log file at the end of the script
     */
    FileModule.prototype._readLogFile = function() {
        var logFile = path.resolve( __dirname, '../tmp/log.txt' );

        var theLogs = fs.readFileSync( logFile, 'utf8' ).toString().split( '##' );
        theLogs.shift();

        // Log to the console
        theLogs.forEach(function ( log ) {
            console.log( 'Br-Ps: ' + log );
        });
    }

    /*
     * @private
     * Function to clear the log file
     * @return {string} Path to log file.
     */
    FileModule.prototype._clearLogFile = function() {
        var logFile = path.resolve( __dirname, '../tmp/log.txt' );

        fs.writeFileSync( logFile, '' );

        return logFile;
    }

    /*
     * @private
     * Function to determine the path to the JSX to execute
     * If file is dirty, it will point to tmp file, else it'll point to the script's path
     * @param {string} currentDocumentInfo
     * @return {string} Path to tmp file.
     */
    FileModule.prototype._getPathToJSX = function( currentDocInfo ) {
        if ( currentDocInfo.isDirty ) {
            return this._saveTmpFile( currentDocInfo.text );
        } else {
            return currentDocInfo.path;
        }
    }
    
    module.exports = FileModule;
}());

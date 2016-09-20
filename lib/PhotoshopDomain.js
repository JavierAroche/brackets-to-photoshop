/*
 * brackets-to-photoshop (Brackets extension)
 *
 * Photoshop Module
 * Author: Javier Aroche
 *
 */

(function() {

    'use strict';
    
    var fs            = require('fs'),
        path          = require('path'),
        osa           = require('osa'),
        adobeVersions = require('./AdobeVersions.json');
    
    /*
     * Initializes the BracketsToPS domain.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain('Br-Ps')) {
            domainManager.registerDomain('Br-Ps', {major: 0, minor: 1});
        }
        
        domainManager.registerCommand(
            "Br-Ps", 
            "runJSX", 
            runJSX, 
            false, 
            [{name: 'document', type: 'string'}],
            [{name: 'result', type: 'string'}]);
    }
    
    /*
     * @private
     * Handler function to run a JSX through osa.
     * @param {string} path to current jsx document.
     * @return {string} Successful string to display in console.
     */
    function runJSX(document) {
        var psVersion = identifyPhotoshopVersion(),
            // Get path to tmp file and save text in document
            pathToJSX = saveTmpFile(document),
            pathToJSXInclude = "#include \"" + pathToJSX + "\"",
            // Include helpers
            pathToHelpers = path.resolve(__dirname, '../jsx/Helpers.jsx'),
            pathToHelpersInclude = "#include \"" + pathToHelpers + "\"";
        
        if (psVersion) {
            // NOTE: Include space at beginning of JavaScript command to avoid having unwanted errors in console
            osa(
                // Function to execute
                function(psVersion, pathToHelpersInclude, pathToJSXInclude) {
                    return Application(psVersion).doJavascript( ' ' + '\n' + pathToHelpersInclude + '\n' + pathToJSXInclude );
                },
                // Arguments
                psVersion, pathToHelpersInclude, pathToJSXInclude,
                // Callback function
                function(err, result, log) {
                    readLogFile();
                    
                    if ( err ) {
                        if( err.toString().indexOf("if(typeof JSON!=='object')") !== -1 ) {
                            console.error( 'Br-Ps: ' + err.toString().split('->')[0] );
                        } else {
                            console.error( 'Br-Ps: ' + err );
                        }
                    }

                    if ( result ) { 
                        console.log( 'Br-Ps: ' + result );
                    }
                }
            );
        } else {
            return('Br-Ps: No Photoshop version detected.');
        }
    }
    
    /*
     * @private
     * Function to save tmp file
     * @param {string} Text to be saved to tmp file.
     * @return {string} Path to tmp file.
     */
    function saveTmpFile(document) {
        // Locate tmp file
        var tmpFile = path.resolve(__dirname, '../tmp/tmp.txt');
        // Save to tmp file
        fs.writeFileSync(tmpFile, document);

        return tmpFile;
    }
    
    /*
     * @private
     * Function to read the log file at the end of the script
     * @param {string} Text to be saved to tmp file.
     * @return {string} Path to tmp file.
     */
    function readLogFile() {
        // Locate tmp file
        var logFile = path.resolve(__dirname, '../tmp/log.txt');
        // Return text in document. Split by ## identifier
        var theLogs = fs.readFileSync(logFile, 'utf8').toString().split('##');
        // Remove first empty item from array
        theLogs.shift();

        // Log to the console
        theLogs.forEach(function (log) {
            console.log( 'Br-Ps: From JSX: ' + log );
        });
    }
    
    /*
     * @private
     * Function to identify latest Photoshop version
     * @param {string} path to current jsx document.
     * @return {string} Successful string to display in console.
     */
    function identifyPhotoshopVersion() {
        // Possible Photoshop Versions
        var psVersions = ['Adobe Photoshop CC 2015.5', 'Adobe Photoshop CC 2015', 'Adobe Photoshop CC 2014', 'Adobe Photoshop CS6', 'Adobe Photoshop CS5'],
            foundPSVersion = false;
        
        for (var i = 0; i < psVersions.length; i++){
            try {
                fs.statSync("/Applications/" + psVersions[i]).isFile();
                foundPSVersion = true;
                console.info('Br-Ps: Running ' + psVersions[i]);
                return psVersions[i];
            } catch(err) {}
        }
        
        if (!foundPSVersion) { return false; }
    }
    
    exports.init = init;
}());

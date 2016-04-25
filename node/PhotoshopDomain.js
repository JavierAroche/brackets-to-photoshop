/*
 * brackets-to-photoshop (Brackets extension)
 *
 * Photoshop Module
 * Author: Javier Aroche
 *
 */

(function() {

    'use strict';
    
    var fs   = require('fs'),
        path = require('path'),
        osa  = require('osa');
    
   /**
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
    
    /**
     * @private
     * Handler function to run a JSX through osa.
     * @param {string} path to current jsx document.
     * @return {string} Successful string to display in console.
     */
    function runJSX(document) {
        var psVersion = identifyPhotoshopVersion();
        var path = saveTmpFile(document);
                                
        if (psVersion) {
            osa(
                // Function to execute
                function(psVersion, path) {                    
                    return Application(psVersion).doJavascript("#include \"" + path + "\"");
                },
                // Arguments
                psVersion, path,
                // Callback function
                function(err, result, log) {
                    if (err) { console.error('Br-Ps: ' + err); }
                    if (result) { console.log('Br-Ps: ' + result); }
                }
            );
        } else {
            return('Br-Ps: No Photoshop version detected.');
        }
    }
    
   /**
     * @private
     * Function to save tmp file, if file isDirty
     * @param {string} Text to be saved to tmp file.
     * @return {string} Path to tmp file.
     */
    function saveTmpFile(document) {
        // Locate tmp file
        var tmpFile = path.resolve(__dirname, '../tmp/tmp');
        // Save to tmp file
        fs.writeFileSync(tmpFile, document);
        return tmpFile;
    }
    
   /**
     * @private
     * Function to identify latest Photoshop version
     * @param {string} path to current jsx document.
     * @return {string} Successful string to display in console.
     */
    function identifyPhotoshopVersion() {
        // Possible Photoshop Versions
        var psVersions = ['Adobe Photoshop CC 2017', 'Adobe Photoshop CC 2016', 'Adobe Photoshop CC 2015', 'Adobe Photoshop CC 2014', 'Adobe Photoshop CS6', 'Adobe Photoshop CS5'],
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
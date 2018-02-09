/*
 * brackets-to-photoshop (Brackets extension)
 *
 * File System Module
 * Author: Javier Aroche
 *
 */

(function() {

    'use strict';
    
    var fs = require( 'fs' );

    /*
     * MacOS constructor.
     * 
     * @constructor
     */
    function FileSystem() {}

    /*
     * @private
     * Function to validate if target application exists in user's system
     * @param {string} path to current jsx document.
     * @return {string} Successful string to display in console.
     */
    FileSystem.prototype._validateTargetApplication = function( targetApplication ) {
        try {
            // Check that Application's folder exists
            fs.statSync( '/Applications/' + targetApplication ).isFile();
            console.info( 'Br-Ps: PSVersion: Running ' + targetApplication );
            return true;
        } catch( err ) { return false; }
    }
    
    /*
     * @private
     * Function to identify latest application version
     * @param {string} application versions
     * @return {string} Latest application version
     */
    FileSystem.prototype._identifyLatestApplicationVersion = function( applicationVersions ) {
        var foundApplicationVersion = false;

        // Iterate through object keys ( versions )
        for ( var key in applicationVersions ) {
            if ( Object.prototype.hasOwnProperty.call( applicationVersions, key ) ) {
                var applicationVersion = applicationVersions[key];
                
                try {
                    // Check that Application's folder exists
                    fs.statSync( '/Applications/' + applicationVersion ).isFile();
                    foundApplicationVersion = true;

                    console.log( 'Br-Ps: PSVersion: Running ' + applicationVersion );

                    return applicationVersion;
                } catch( err ) {}
            }
        }
        
        // No version was found
        if ( !foundApplicationVersion ) { return false; }
    }
    
    module.exports = FileSystem;
}());

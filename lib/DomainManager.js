/*
 * brackets-to-photoshop (Brackets extension)
 *
 * Domain Manager
 * Author: Javier Aroche
 *
 */

(function() {

    'use strict';
    
    var fs   = require( 'fs' );
    var path = require( 'path' );

    var FileModule       = require( './FileModule' );
    var OsaModule        = require( './OsaModule' );
    var FileSystemModule = require( './FileSystemModule' );

    var adobeVersions    = require( './AdobeVersions.json' );

    var fileSystemModule = new FileSystemModule();
    var fileModule       = new FileModule();
    var osaModule        = new OsaModule();

    /*
     * @private
     * Initializes the BracketsToPS domain manager.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init( domainManager ) {
        if ( !domainManager.hasDomain( 'Br-Ps' ) ) {
            domainManager.registerDomain( 'Br-Ps', { major: 0, minor: 1 } );
        }
        
        domainManager.registerCommand(
            'Br-Ps', 
            'main', 
            main, 
            false, 
            [{name: 'document', type: 'object'}],
            [{name: 'result', type: 'string'}]);
    }

    function main( currentDocInfo ) {
        var application = _getTargetApplication( currentDocInfo );

        var pathToJSX = fileModule._getPathToJSX( currentDocInfo );

        osaModule._runJSX( application.app, application.version, pathToJSX );
    }

    /*
     * Helpers
     */

    /*
     * @private
     * Function to get the target application
     * @return {string} Target application
     */
    function _getTargetApplication( currentDocInfo ) {
        // Identify if user added a specific application target / version
        var targetApplication = fileModule._identifyTargetApplication( currentDocInfo.text );

        if ( targetApplication.version == null ) {
            // No #target application was found. Identify the latest Photoshop version
            targetApplication.version = fileSystemModule._identifyLatestApplicationVersion( adobeVersions.photoshop );

            if ( targetApplication.version == false ) {
                // No version of Photoshop was detected
                throw new Error( 'Br-Ps: No Photoshop version detected.' );
            }
        } else {

            switch ( targetApplication.version ) {
                case 'photoshop':
                    targetApplication.version = fileSystemModule._identifyLatestApplicationVersion( adobeVersions.photoshop );
                    break;

                case 'illustrator':
                    // AppleScript / Osascript only recognizes one version
                    targetApplication.version = 'Adobe Illustrator';
                    console.info( 'Br-Ps: Running ' + 'Adobe Illustrator' );
                    break;

                case 'aftereffects':
                    targetApplication.version = fileSystemModule._identifyLatestApplicationVersion( adobeVersions.aftereffects );
                    break;

                case 'indesign':
                    targetApplication.version = fileSystemModule._identifyLatestApplicationVersion( adobeVersions.indesign );
                    break;

                case 'bridge':
                    targetApplication.version = fileSystemModule._identifyLatestApplicationVersion( adobeVersions.bridge );
                    break;

                default:
                    // User selected a specific version
                    targetApplication.version = adobeVersions[targetApplication.app][targetApplication.version];
                    
                    // Validate if target application exists in user's system
                    if ( !fileSystemModule._validateTargetApplication( targetApplication.version ) ) {
                        throw new Error( 'Br-Ps: Application ' + targetApplication.version + ' does not exist' ); 
                    }

                    break;
            }
        }

        return targetApplication;
    }

    exports.init = init;
}());

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
    var os   = require('os');
    
    var FileModule       = require( './FileModule' );
    var SystemModule  	 = require( './SystemModule' );
    var MacOSFSModule    = require( './MacOSFSModule' );
    var WindowsFSModule  = require( './WindowsFSModule' );

    var adobeVersions    = require( './AdobeVersions.json' );

    var macOSFSModule    = new MacOSFSModule();
    var windowsFSModule  = new WindowsFSModule();
    var fileModule       = new FileModule();
    var systemModule  	 = new SystemModule();
	
	var osPlatform = os.platform();

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
		
		if( application.version ) {
			var pathToJSX = fileModule._getPathToJSX( currentDocInfo );
			_runJSX( application, pathToJSX );
		}
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
			targetApplication.app = 'photoshop';
			targetApplication.version = _getLatestApplicationVersion( 'photoshop', adobeVersions.photoshop );
			
			if ( !targetApplication.version ) {
				// No version of Photoshop was detected
				throw new Error( 'Br-Ps: No Photoshop version detected.' );
			}
        } else {
            switch ( targetApplication.version ) {
                case 'photoshop':
					console.log( 'Br-Ps: photoshop' )
					targetApplication.version = _getLatestApplicationVersion( targetApplication.version, adobeVersions.photoshop );
                    break;

                case 'illustrator':
					// AppleScript / Osascript only recognizes one version
					targetApplication.version = _getLatestApplicationVersion( targetApplication.version, adobeVersions.illustrator );
                    break;

                case 'aftereffects':
					targetApplication.version = _getLatestApplicationVersion( targetApplication.version, adobeVersions.aftereffects );
                    break;

                case 'indesign':
					targetApplication.version = _getLatestApplicationVersion( targetApplication.version, adobeVersions.indesign );
                    break;

                case 'bridge':
					targetApplication.version = _getLatestApplicationVersion( targetApplication.version, adobeVersions.bridge );
                    break;

				default:
					// Validate app in JSON
					if( adobeVersions.hasOwnProperty(targetApplication.app) ) {
						// Validate app version in JSON
						if( adobeVersions[targetApplication.app].hasOwnProperty(targetApplication.version) ) {							
							// Validate application in user's system
							var adobeVersion = adobeVersions[targetApplication.app][targetApplication.version];
                    		if( _validateTargetApplication( targetApplication.app, adobeVersion ) ) {
								targetApplication.version = adobeVersion;
							} else {
								console.error( 'Br-Ps: Application ' + targetApplication.version + ' does not exist.' );
								targetApplication.version = undefined;
							}
						} else {
							console.error( 'Br-Ps: Application ' + targetApplication.version + ' does not exist.' ); 
							targetApplication.version = undefined;
						}
					} else {
						console.error( 'Br-Ps: Application ' + targetApplication.app + ' does not exist.' );
						targetApplication.version = undefined;
					}
                    break;
            }
        }

        return targetApplication;
    }
    
    /*
     * @private
     * Function to get the latest application version
     * @return {string} Latest application version
     */
    function _getLatestApplicationVersion( application, applicationVersions ) {
        switch( osPlatform ) {
            case 'darwin':
                return macOSFSModule._identifyLatestApplicationVersion( application, applicationVersions );
                break;
            case 'win32':
                return windowsFSModule._identifyLatestApplicationVersion( application, applicationVersions );
                break;
            default:
                break;
        }
    }
    
    /*
     * @private
     * Function to validate the user's target application 
     * @return {string} Latest application version
     */
    function _validateTargetApplication( application, applicationVersion ) {
        switch( osPlatform ) {
            case 'darwin':
                if( !macOSFSModule._validateTargetApplication( application, applicationVersion ) ) {
					return false; 
				}
                break;
            case 'win32':
                if( !windowsFSModule._validateTargetApplication( application, applicationVersion ) ) {
					return false;
				}
                break;
            default:
                break;
        }
		
		return true;
    }
    
    /*
     * @private
     * Function to run a JSX, targetting specific OS platforms
     * @return {string} Latest application version
     */
    function _runJSX( app, appVersion, pathToJSX ) {
        switch( osPlatform ) {
            case 'darwin':
                systemModule._runJSXInMacOS( app, appVersion, pathToJSX );
                break;
            case 'win32':
                systemModule._runJSXInWindows( app, appVersion, pathToJSX );
                break;
            default:
                break;
        }
    }

    exports.init = init;
}());

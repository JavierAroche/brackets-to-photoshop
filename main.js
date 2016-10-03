/*
 * brackets-to-photoshop (Brackets extension)
 *
 * Main
 * Author: Javier Aroche
 *
 */

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Javier Aroche
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    'use strict';

    // Brackets Modules
    var DocumentManager   = brackets.getModule( 'document/DocumentManager' ),
        Dialogs           = brackets.getModule( 'widgets/Dialogs' ),
        AppInit           = brackets.getModule( 'utils/AppInit' ),
        NodeDomain        = brackets.getModule( 'utils/NodeDomain' ),
        ExtensionUtils    = brackets.getModule( 'utils/ExtensionUtils' ),
        WorkspaceManager  = brackets.getModule( 'view/WorkspaceManager' ),
        CommandManager    = brackets.getModule( 'command/CommandManager' ),
        KeyBindingManager = brackets.getModule( 'command/KeyBindingManager' );
    
    // Load domain
    var DomainManager_path = ExtensionUtils.getModulePath(module, 'lib/DomainManager');
    var DomainManager      = new NodeDomain('Br-Ps', DomainManager_path);
    
    var panelHTML = require("text!html/console.html"),
        panel,
        $panel,
        $clearBtn,
        $console,
        $closeBtn,
        $psVersion,
        message;
        
    /*
     * @private
     * Function to validate and get the properties of the current document
     */
    function _validateCurrentDocument() {
        // Get info of working file
        var currentDoc = DocumentManager.getCurrentDocument();
        var currentDocInfo = {
            path    : currentDoc.file.fullPath,
            isDirty : currentDoc.isDirty,
            text    : currentDoc.getText()
        };

        if ( currentDocInfo.text !== '' ) {
            _sendToDomain(currentDocInfo);
        }
    }

    /*
     * @private
     * Function to connect to the Domain Manager
     */
    function _sendToDomain(currentDocInfo) {
        _showConsolePanel();
        
        // Connect to domain - execute 'main' function
        DomainManager.exec('main', currentDocInfo)
            .done(function (result) {
                console.log(result);
            }).fail(function (err) {
                console.error("Br-Ps: Failed to execute command 'runJSX' - " + err);
            });
    }

    /*
     * @private
     * Function to show the console in Brackets
     */ 
    function _showConsolePanel() {
        panel.show();
    }
    
    /*
     * @private
     * Function to send a message to the console in Brackets
     */
    function _sendToConsole( message, type ) {
        message = _filerErrors( message );
        
        if ( message ) {
            $console.append('<li class="' + type + '"><pre>' + message + '</pre></li>');
            $console.scrollTop = $console.scrollHeight;

            _updateScroll();
        }
    }
    
    /*
     * @private
     * Function to filter the messages to display in the console
     * @return {string} message to be displayed
     */
    function _filerErrors( message ) {
        if ( message.search( 'Br-Ps' ) !== -1) {
            return message;
        }
    }
    
    /*
     * @private
     * Function to display the current Application executing the script in the console
     */
    function _displayPSVersion( message ) {        
        message = _filerErrors( message );
        
        message = message.split( ':' );
        message = message[message.length -1];
        
        $psVersion.html(message);
    }
    
    /*
     * @private
     * Function to clear the console in Brackets
     */
    function clearConsole() {
        $console.html("");
    }
    
    /*
     * @private
     * Function to hide the console in Brackets
     */
    function hideConsolePanel() {
        panel.hide();
    }
    
    /*
     * @private
     * Function to update the scroll position to display the last maessage
     */
    function _updateScroll(){
        var element       = document.getElementById("br-ps-console");
        element.scrollTop = element.scrollHeight;
    }

    /*
     * @public
     * Function to execute when Brackets has loaded
     */
    AppInit.appReady(function () {
        
        // RunJSX Icon
        ExtensionUtils.loadStyleSheet(module, "styles/styles.css");
        $(document.createElement("a"))
            .attr("id", "br-ps")
            .attr("href", "#")
            .attr("title", "Brackets to Photoshop")
            .on("click", _validateCurrentDocument)
            .appendTo($("#main-toolbar .buttons"));
        
        // Set key binding
        var keyboardShortcut_ID = "brackets-to-photoshop.run";
        CommandManager.register('Run Brackets-To-Photoshop', keyboardShortcut_ID, _validateCurrentDocument);
        KeyBindingManager.addBinding(keyboardShortcut_ID, "Cmd-Shift-P");
        
        // Create panel
        panel = WorkspaceManager.createBottomPanel("brackets-to-photoshop.panel", $(panelHTML));
        
        // Get HTML items
        $panel     = $('#br-ps-panel');
        $clearBtn  = $panel.find('#clearBtn');
        $console   = $panel.find('.resizable-content ul');
        $closeBtn  = $panel.find('.close');
        $psVersion = $panel.find('#psVersion');
        
        // On-clicks
        $clearBtn.click(clearConsole);
        $closeBtn.click(hideConsolePanel);
        
        /*
         * Extend console functions to be filtered and displayed in Brackets console
         * console.log / console.warn / console.error / console.info
         */
        var _log   = console.log,
            _warn  = console.warn,
            _error = console.error,
            _info  = console.info;

        console.log = function() {
            var arg = arguments;

            _sendToConsole(arg[0], 'log');
            return _log.apply(console, arguments);
        };

        console.warn = function() {
            var arg = arguments;

            _sendToConsole(arg[0], 'warn');
            return _warn.apply(console, arguments);
        };

        console.error = function() {
            var arg = arguments;

            _sendToConsole(arg[0], 'error');
            return _error.apply(console, arguments);
        };
        
        console.info = function() {
            var arg = arguments;

            // Using console.info only to find the Application logged from Domain
            _displayPSVersion(arg[0]);
            return _info.apply(console, arguments);
        };
    });
});
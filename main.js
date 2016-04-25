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
    var DocumentManager     = brackets.getModule("document/DocumentManager"),
        Dialogs             = brackets.getModule("widgets/Dialogs"),
        AppInit             = brackets.getModule("utils/AppInit"),
        NodeDomain          = brackets.getModule("utils/NodeDomain"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        WorkspaceManager    = brackets.getModule("view/WorkspaceManager"),
        CommandManager      = brackets.getModule('command/CommandManager'),
        KeyBindingManager   = brackets.getModule("command/KeyBindingManager");
    
    // Load domain
    var PhotoshopDomain_path = ExtensionUtils.getModulePath(module, 'node/PhotoshopDomain');
    var photoshop = new NodeDomain('Br-Ps', PhotoshopDomain_path);
    
    var panelHTML = require("text!html/console.html"),
        panel, $panel, $clearBtn, $console, $closeBtn, $psVersion, message;
        
    // Validate current document
    function _validateCurrentDocument() {
        // Get info of working file
        var currentDoc = {};
        currentDoc.doc = DocumentManager.getCurrentDocument();
        currentDoc.text = currentDoc.doc.getText();
        
        _sendToDomain(currentDoc);
    }
    
    // Send command to BracketsToPS domain
    function _sendToDomain(currentDoc) {
        // Show console
        _showConsolePanel();
        
        // Connect to domain - execute 'runJSX'
        photoshop.exec('runJSX', currentDoc.text)
            .done(function (result) {
                console.log(result);
            }).fail(function (err) {
                 console.error("Br-Ps: Failed to execute command 'runJSX' - " + err);
            });
    }

    // Panel functions  
    function _showConsolePanel() {
        panel.show();
    }
    
    function _sendToConsole(message, type) {
        message = _filerErrors(message);
        
        if (message) {
            $console.append('<li class="' + type + '">' + message + '</li>');
            $console.scrollTop = $console.scrollHeight;
        }
        
        _updateScroll();
    }
    
    function _filerErrors(message) {
        if (message.search('Br-Ps') !== -1) {
            return message;
        }
    }
    
    function _displayPSVersion(message) {        
        message = _filerErrors(message);
        
        message = message.split(':');
        message = message[message.length -1];
        
        $psVersion.html(message);
    }
    
    function clearConsole() {
        $console.html("");
    }
    
    function hideConsolePanel() {
        panel.hide();
    }
    
    function _updateScroll(){
        var element = document.getElementById("br-ps-console");
        element.scrollTop = element.scrollHeight;
    }

    // Loaded Brackets
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
        
        // Get html items
        $panel = $('#br-ps-panel');
        $clearBtn = $panel.find('#clearBtn');
        $console = $panel.find('.resizable-content ul');
        $closeBtn = $panel.find('.close');
        $psVersion = $panel.find('#psVersion');
        
        // On-clicks
        $clearBtn.click(clearConsole);
        $closeBtn.click(hideConsolePanel);
        
        // Get Console logs / warnings / errors
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

            _displayPSVersion(arg[0]);
            return _info.apply(console, arguments);
        };
    });
});
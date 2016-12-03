# Brackets-to-Photoshop

### Description
---------
Brackets to Photoshop is an extension for [Brackets](https://github.com/adobe/brackets/) that allows you to execute a JSX file in Photoshop.

### How to Install
---------
Search for **Brackets-To-Photoshop** in the Extension Manager.

### Usage
---------
This extension works on Brackets current document. 

If your file is saved, the extension will execute the script using its local path, otherwise it will execute it through a temporary file.

Click on the **Brackets to Photoshop** button on your right sidebar, or hit the shortcut **Cmd-Shift-P** to execute your script.

![br-ps-icon](https://raw.githubusercontent.com/JavierAroche/brackets-to-photoshop/master/images/br-ps-icon.jpg)

### Target Adobe Applications
---------
Target specific [Adobe applications and versions](https://github.com/JavierAroche/brackets-to-photoshop/blob/master/lib/AdobeVersions.json) in your code by using ExtendScript's #target. Photoshop is the default application. 

```
/* Photoshop */
#target photoshop           // Latest Photoshop version installed
#target photoshop-110       // Adobe Photoshop CC 2017
#target photoshop-100       // Adobe Photoshop CC 2015.5
#target photoshop-90        // Adobe Photoshop CC 2015
#target photoshop-80        // Adobe Photoshop CC 2014
#target photoshop-70        // Adobe Photoshop CC
#target photoshop-60        // Adobe Photoshop CS6
#target photoshop-50        // Adobe Photoshop CS5

/* Illustrator */
#target illustrator         // Latest Illustrator version installed
#target illustrator-20      // Adobe Illustrator CC 2015.3
#target illustrator-19.2    // Adobe Illustrator CC 2015.2
#target illustrator-19.0    // Adobe Illustrator CC 2015
#target illustrator-18      // Adobe Illustrator CC 2014
#target illustrator-17      // Adobe Illustrator CC
#target illustrator-16      // Adobe Illustrator CS6
#target illustrator-15      // Adobe Illustrator CS5

/* After Effects */
#target aftereffects        // Latest After Effects version installed
#target aftereffects-13.8   // Adobe After Effects CC 2015.3
#target aftereffects-13.7   // Adobe After Effects CC 2015.2
#target aftereffects-13.6   // Adobe After Effects CC 2015.1
#target aftereffects-13.5   // Adobe After Effects CC 2015
#target aftereffects-13     // Adobe After Effects CC 2014
#target aftereffects-12     // Adobe After Effects CC
#target aftereffects-11     // Adobe After Effects CS6
#target aftereffects-10     // Adobe After Effects CS5

/* InDesign */
#target indesign            // Latest InDesign version installed
#target indesign-11.4       // Adobe InDesign CC 2015.4
#target indesign-11.2       // Adobe InDesign CC 2015.2
#target indesign-11.1       // Adobe InDesign CC 2015.1
#target indesign-11         // Adobe InDesign CC 2015
#target indesign-10         // Adobe InDesign CC 2014
#target indesign-9          // Adobe InDesign CC
#target indesign-8          // Adobe InDesign CS6
#target indesign-7          // Adobe InDesign CS5

/* Bridge */
#target bridge              // Latest Bridge version installed
```

### Include external files
---------
If your script file is saved, the extension will load your script path and execute it. This makes it easier to use ExtendScript's #include to load relative external files.

```
#include "~/Development/personal/descriptor-info/jsx/descriptor-info.jsx"
```

If your file is not saved, the extension will execute your script through a temporary file, making it impossible to load external relative files using #include. Absolue paths will always work.


### Polyfills
---------
brackets-to-photoshop includes by default 3 JavaScript polyfills, which you can use in your code at any time.
* JSON.stringify
* JSON.parse
* Array.forEach

### Log to the console
---------
This extension has an internal module that recreates JavaScript's console module, including a way to log a JSON.strigify response.

You can use functions in your code such as:
```
console.log( 'Hello' );
// Returns: [node-log 4:16:02 PM] Br-Ps: [log: 16:16:2.649] Hello

console.info( 'Hello' );
// Returns: [node-log 4:16:23 PM] Br-Ps: [info: 16:16:23.823] Hello

console.error( 'Hello' );
// Returns: [node-log 4:16:37 PM] Br-Ps: [error: 16:16:37.985] Hello

console.stringify( { foo : 'bar' } );
// Returns: [node-log 4:16:50 PM] Br-Ps: [stringify: 16:16:50.185] {
    "foo": "bar"
}
```

This extension also allows the use of ExtendScript's native $.write and $.writeln functions to log to the console using JSON.stringify.
```
$.writeln( "Hello" );
// Returns: [node-log 4:20:34 PM] Br-Ps: [log: 16:20:34.337] "Hello"

$.write( "Hello" );
// Returns: [node-log 4:20:37 PM] Br-Ps: [log: 16:20:37.171] "Hello"
```

### Anatomy of a log
---------
**Successful execution**
```
function foo() {
    return app.name;
}
foo();
// Returns: [node-log 4:53:28 PM] Br-Ps: Result: Adobe Photoshop
```
Breakdown:
* **[node-log 4:53:28 PM]** --> Time stamp of when the extension executed the script through Node
* **Br-Ps:** --> Identifier to filter errors to the extension's console
* **Result: Adobe Photoshop** --> Message received from the Adobe application mimicking ExtendScript's "Result:" log

**console.log**
```
console.log( 'Hello' );
// Returns: [node-log 4:16:02 PM] Br-Ps: [log: 16:16:2.649] Hello
```
Breakdown:
* **[node-log 4:16:02 PM]** --> Time stamp of when the extension executed the script through Node
* **Br-Ps:** --> Identifier to filter errors to the extension's console
* **[log: 16:16:2.649]** --> Time stamp of when the console.log function was executed inside your script
* **Hello** --> Message received from the Adobe application

**Error in execution**
```
return app.name;
// Returns: [node-error 4:57:52 PM] Br-Ps: 78:256: execution error: Adobe Photoshop CC 2015 got an error: General Photoshop error occurred. This functionality may not be available in this version of Photoshop.
- Error 30: Illegal 'return' outside of a function body.
Line: 1
```
Breakdown:
* **[node-error 4:57:52 PM]** --> Time stamp of when the extension executed the script through Node
* **Br-Ps:** --> Identifier to filter errors to the extension's console
* **78:256: execution error: Adobe Photoshop CC 2015 got an error: General Photoshop error occurred. This functionality may not be available in this version of Photoshop.** --> Execution error received from Photoshop
* **- Error 30: Illegal 'return' outside of a function body.** --> Descriptive error
* **Line: 1** --> Line in your script that triggered the error


### Console
---------
A console will show up at the bottom of your editor displaying any messages returned from the executed script. Errors will display in red.

The console includes a "Running Application" and an "Execution Time" stamp and a "Clear" button to clear the console. You can also copy the output from the console.

![br-ps-console](https://raw.githubusercontent.com/JavierAroche/brackets-to-photoshop/master/images/br-ps-console.jpg)

### Known Limitations
---------
* This extension uses Photoshop's AppleScript API, so it will only work for MacOS users at the moment.

### Changelog
---------
**v0.0.5 (Nov 16 2016)**
* Fix: Updated error handling on exec to display a more accurate error in the console

**v0.0.4 (Nov 15 2016)**
* Bug Fix: Encoded paths to be included to avoid special characters

**v0.0.3 (Nov 15 2016)**
* Restructured brackets-to-photoshop plugin
* Added compatibility with multiple Adobe programs and versions
* Replaced osa module with node's exec
* Added maxBuffer to support strings up to 50mbs
* Included JSON and Array polyfill to use functions such as JSON.stringify, JSON.parse and Array.forEach
* Included console constructor to log information to console after the script is done executing
* Added ability to $.write and $.writeln to the console
* Include external files in your JSX script when document is saved
* Ability to select output in Brackets console
* Added execution time
* Cleaned up the console HTML / CSS

**v0.0.2 (Jul 12 2016)**
* Added Photoshop CC 2015.5 compatibility.

**v0.0.1 (Apr 25 2016)**
* Initial development.

### License
---------
MIT © Javier Aroche
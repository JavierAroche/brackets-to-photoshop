# Brackets to Photoshop
Brackets to Photoshop is an extension for [Brackets](https://github.com/adobe/brackets/) to execute a JSX file in Photoshop.

Since it's using Photoshop's AppleScript API, this extension will only work for MacOS users at the moment.

### How to Install
Search for **Brackets-To-Photoshop** in the Extension Manager.

### How to Use
This extension works on Brackets current document. The file doesn't need to be saved since it's reading directly from the editor.

Click on the **Brackets to Photoshop** button on your right sidebar, or hit the shortcut **Cmd-Shift-P**

![br-ps-icon](https://raw.githubusercontent.com/JavierAroche/brackets-to-photoshop/master/images/br-ps-icon.jpg)

The extension will determine your latest Photoshop version installed and execute the script in it.

Currently supported Photoshop versions:

- Adobe Photoshop CC 2017
- Adobe Photoshop CC 2015.5
- Adobe Photoshop CC 2015
- Adobe Photoshop CC 2014
- Adobe Photoshop CS6
- Adobe Photoshop CS5

### Console

A console will show up at the bottom displaying any messages returned from Photoshop. Errors will display in red.

![br-ps-console](https://raw.githubusercontent.com/JavierAroche/brackets-to-photoshop/master/images/br-ps-console.jpg)

### Console Features

- JSON and Array polyfill to use functions such as JSON.stringify, JSON.parse and Array.forEach
- Added ability to $.write and $.writeln to the console

### Changelog

#### v0.0.3 (Nov 15 2016)
-----
*   Restructured brackets-to-photoshop plugin
*   Added compatibility with multiple Adobe programs and versions
*   Replaced osa module with node's exec
*   Added maxBuffer to support strings up to 50mbs
*   Included JSON and Array polyfill to use functions such as JSON.stringify, JSON.parse and Array.forEach
*   Included console constructor to log information to console after the script is done executing
*   Added ability to $.write and $.writeln to the console
*   Include external files in your JSX script when document is saved
*   Ability to select output in Brackets console
*   Added execution time
*   Cleaned up the console HTML / CSS

#### v0.0.2 (Jul 12 2016)
-----
*   Added Photoshop CC 2015.5 compatibility.

#### v0.0.1 (Apr 25 2016)
-----
*   Initial development.

### License
MIT-licensed
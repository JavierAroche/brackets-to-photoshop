# Brackets to Photoshop
Brackets to Photoshop is an extension for [Brackets](https://github.com/adobe/brackets/) to execute a JSX file in Photoshop using the [osa](https://github.com/brandonhorst/node-osa) module, which uses osascript in MacOS.

Since it's using Photoshop's AppleScript API, this extension will only work for MacOS users at the moment.

### How to Install
Search for **Brackets-To-Photoshop** in the Extension Manager.

### How to Use
This extension works on Brackets current document. The file doesn't need to be saved since it's reading directly from the editor.

Click on the **Brackets to Photoshop** button on your right sidebar, or hit the shortcut **Cmd-Shift-P**

![br-ps-icon](https://raw.githubusercontent.com/JavierAroche/brackets-to-photoshop/master/images/br-ps-icon.jpg)

The extension will determine your latest Photoshop version installed and execute the script in it.

Currently supported Photoshop versions:

- Adobe Photoshop CC 2016
- Adobe Photoshop CC 2015
- Adobe Photoshop CC 2014
- Adobe Photoshop CS6
- Adobe Photoshop CS5

A console will show up at the bottom displaying any messages returned from Photoshop. Errors will display in red.

![br-ps-console](https://raw.githubusercontent.com/JavierAroche/brackets-to-photoshop/master/images/br-ps-console.jpg)

### License
MIT-licensed
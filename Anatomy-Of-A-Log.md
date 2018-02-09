# Anatomy of a log

## Successful execution
```
function foo() {
    return app.name;
}
foo();
// Returns: [node-log 4:53:28 PM] Br-Ps: Result: Adobe Photoshop
```
Breakdown:
* `[node-log 4:53:28 PM]` --> Time stamp of when the extension executed the script through Node
* `Br-Ps:` --> Identifier to filter errors to the extension's console
* `Result: Adobe Photoshop` --> Message received from the Adobe application mimicking ExtendScript's "Result:" log

## console.log
```
console.log( 'Hello' );
// Returns: [node-log 4:16:02 PM] Br-Ps: [log: 16:16:2.649] Hello
```
Breakdown:
* `[node-log 4:16:02 PM]` --> Time stamp of when the extension executed the script through Node
* `Br-Ps:` --> Identifier to filter errors to the extension's console
* `[log: 16:16:2.649]` --> Time stamp of when the console.log function was executed inside your script
* `Hello` --> Message received from the Adobe application

## Error in execution
```
return app.name;
// Returns: [node-error 4:57:52 PM] Br-Ps: 78:256: execution error: Adobe Photoshop CC 2015 got an error: General Photoshop error occurred. This functionality may not be available in this version of Photoshop.
- Error 30: Illegal 'return' outside of a function body.
Line: 1
```
Breakdown:
* `[node-error 4:57:52 PM]` --> Time stamp of when the extension executed the script through Node
* `Br-Ps:` --> Identifier to filter errors to the extension's console
* `78:256: execution error: Adobe Photoshop CC 2015 got an error: General Photoshop error occurred. This functionality may not be available in this version of Photoshop.` --> Execution error received from Photoshop
* `- Error 30: Illegal 'return' outside of a function body.` --> Descriptive error
* `Line: 1` --> Line in your script that triggered the error

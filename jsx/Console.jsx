/*
 * brackets-to-photoshop (Brackets extension)
 *
 * Console Module
 * Author: Javier Aroche
 *
 */

/*
 * Console constructor.
 * 
 * @constructor
 */
function Console() {
	this.newDate;
	this.newTime;
	this.logType;
	// Receive file path
	this.write_file = File(File($.fileName).parent.parent + '/tmp/log.txt');
	this.clear();
}

/*
 * @private
 * Handler function to clear the log.txt file
 * @param {string} message to be logged
 */
Console.prototype.clear = function() {
	// Open the file
	this.write_file.open('w', undefined, undefined);
	this.write_file.encoding = "UTF-8";
	this.write_file.close();
}

/*
 * @public
 * Handler function to write a message to the log.txt file
 * @param {string} message to be logged
 */
Console.prototype.writeToFile = function(message) {
	// Open the file
	this.write_file.open('a', undefined, undefined);
	this.write_file.encoding = "UTF-8";

	// Write message to file
	this.newDate = new Date();
	this.newTime = this.newDate.getHours() + ':' + this.newDate.getMinutes() + ':' + this.newDate.getSeconds() + '.' + this.newDate.getMilliseconds();
	
	this.write_file.writeln('##[' + this.logType + ': ' + this.newTime + '] ' +  message );
	this.write_file.close();
}

/*
 * @public
 * Handler function to log a message to the log.txt file
 * @param {string} message to be logged
 */
Console.prototype.log = function(message) {
	this.logType = 'log';
	this.writeToFile(message);
}

/*
 * @public
 * Handler function to log a message to the log.txt file
 * @param {string} message to be logged
 */
Console.prototype.warn = function(message) {
	this.logType = 'warn';
	this.writeToFile(message);
}

/*
 * @public
 * Handler function to log a message to the log.txt file
 * @param {string} message to be logged
 */
Console.prototype.error = function(message) {
	this.logType = 'error';
	this.writeToFile(message);
}

/*
 * @public
 * Handler function to log a message to the log.txt file
 * @param {string} message to be logged
 */
Console.prototype.info = function(message) {
	this.logType = 'info';
	this.writeToFile(message);
}

/*
 * @public
 * Handler function to log a message to the log.txt file
 * @param {string} message to be logged
 */
Console.prototype.stringify = function(message) {
	this.logType = 'stringify';
	this.writeToFile( JSON.stringify( message, null, "    " ) );
}

// Create a new Console instance
var console = new Console();
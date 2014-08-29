/**
 * Jack Chi (@_jackchi_)
 * Pheonetic Index on Words with DoubleMetaphone (https://github.com/hgoebl/doublemetaphone)
 * Node.js Script to test WordIndex
 *
 * npm install doublemetaphone
 *
 * node doublemetaphone.js
 */
var DoubleMetaphone = require('doublemetaphone'),
    encoder = new DoubleMetaphone();

var stdin = process.stdin, stdout = process.stdout;
	stdin.setEncoding('utf8');

// asks user for input words and outputs metaphone indices
function ask(){
	stdin.resume();
	stdout.write("Enter a word: ");
	stdin.on('data', function(data) {
		var w = data.toString().trim();
   		console.log('Word:', w);
   		console.log('Metaphone:', encoder.doubleMetaphone(w));
		if (data === 'quit\n') {
			console.log("BYE!");
  			process.exit();
		} else {
			ask();
		}
	 });
} 

// run
ask();
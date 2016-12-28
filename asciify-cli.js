var asciify = require('asciify-image');
var cli = require('cli');
var detect = require('detect-file-type');
var HeadlessTerminal = require('headless-terminal');
var fs = require('fs');
var PNG = require('pngjs').PNG;

options = cli.parse({
	file: ['f', 'Image file to process', 'file', null],
	output: ['o', 'Output location including filename', 'file', './output.txt'],
	width: ['w', 'Width of output image', 'int', null],
	height: ['h', 'Height of output image', 'int', null]
});

var valid_file_types = ['image/jpeg', 'image/png', 'image/gif']
var asciify_options = { fit: 'box', format: 'string' }

if(options.width != null && options.height != null) {
	asciify_options.width = options.width;
	asciify_options.height = options.height;
} else {
	// Default ASCII Width and Height
	asciify_options.width = 640;
	asciify_options.height = 480;
}

if(options.file != null) {
	// Get information about file type.
	detect.fromFile(options.file, function(err, file_info) {
		if(err) {
			return console.log(err);
		} else {
			if( valid_file_types.includes(file_info.mime) ) {
				asciify(options.file, asciify_options, function(asciified) {
					// Text output
					console.log(asciified)

					// Image output using terminal emulation and screen buffer dump
					//var terminal = new HeadlessTerminal(asciify_options.width, asciify_options.height)
					
					// Output framebuffer -- Test -- Works
					//terminal.write(asciified)
					//fs.writeFileSync('output', terminal.displayBuffer.toString());
	
					// Save screen buffer as image Following 3 lines don't work.
					//png = PNG.sync.read(terminal.displayBuffer.toString());	
					//png_buffer = PNG.sync.write(png);
					//fs.writeFileSync('out.png', png_buffer);	
				});		
			} else {
				return console.log("Unsupported File Type. Currently Supported File Types are JPG, PNG, GIF");
			} 
		}
	});
}

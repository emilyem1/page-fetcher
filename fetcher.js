const fs = require('fs'); // import file system
const request = require('request'); // import request module

const url = process.argv[2]; // url at [2] in command line
const localFile = process.argv[3]; // local file at [3] in command line

const fileStream = fs.createWriteStream(localFile); /* create a writable stream to a localFile */

request(url)
  .on('response', response => { // upon a response
    if (response.statusCode !== 200) { // if anything but code 200
      console.error(`Error: Received status code ${response.statusCode}`);
      fileStream.close();
      return;
    }
    response.on('data', data => { // when 'data' is triggered
      fileStream.write(data); // write the data to fileStream
    });

    response.on('end', () => { // upon .end event in data
      fileStream.close(); // close the fileStream
      const fileSize = fs.statSync(localFile).size; /* Get the size of the downloaded file */
      console.log(`Downloaded and saved ${fileSize} bytes to ${localFile}`);
    }); // log the file size that went into localFile
  });


/* if I was using .pipe instead on line 16 it would look like this:  response.pipe(fileStream); */
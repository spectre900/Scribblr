const formidable = require('express-formidable');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(formidable());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


//API to save images locally
app.post('/api/save', (req, res) => {
  const imagePath = req.files.img.path;
  const imageName = req.files.img.name;
  if (!fs.existsSync('./images')){
    fs.mkdirSync('./images');
  }
  fs.writeFileSync('images/'+imageName, fs.readFileSync(imagePath));
  res.sendStatus(200);
});


// API to send a list of all images stored
app.get('/api/show', (req, res) => {
  if (fs.existsSync('./images')){
    fs.readdir('./images', (err, files) => {
      res.send({'images': files});
    });
  }
  else{
    res.send({'images': []});
  }
});


// API to download the image given the image name
app.get('/api/download/:image', (req, res) => {
  if(fs.existsSync('./images/'+req.params.image)){
    res.sendFile(path.resolve(__dirname, 'images', req.params.image));
  }
  else{
    res.send('File not found !');
  }
});

app.get('*', (req, res) => {
  var instructions = 'This is the API for Scribblr <br/><br/>';
  instructions+= '/api/show - Get the list of stored images <br/><br/>';
  instructions+= '/api/download/image.jpeg - Download the image given the image name <br/><br/>';
  instructions+= '/api/save - Upload a new image to the server in JPEG format <br/><br/>';
  res.send(instructions);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
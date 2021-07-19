const formidable = require('express-formidable');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static('client/build'));

app.use(formidable());

app.post('/api/save', (req, res) => {
  const imagePath = req.files.img.path;
  const imageName = req.files.img.name;
  if (!fs.existsSync('./images')){
    fs.mkdirSync('./images');
  }
  fs.writeFileSync('images/'+imageName, fs.readFileSync(imagePath));
  res.sendStatus(200);
});

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

app.get('/api/download/:image', (req, res) => {
  if(fs.existsSync('./images/'+req.params.image)){
    res.sendFile(path.resolve(__dirname, 'images', req.params.image));
  }
  else{
    res.send('File not found !');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
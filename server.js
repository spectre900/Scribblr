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
  fs.writeFileSync('images/'+imageName, fs.readFileSync(imagePath));
  res.sendStatus(200);
});

app.get('/api/show', (req, res) => {
  fs.readdir('./images', (err, files) => {
    if(err){
      res.sendStatus(404);
    }
    res.send({'images': files});
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
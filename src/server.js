
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();

const DIR = './files';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/api', function (req, res) {
  res.end('file catcher example');
});

app.post('/api/upload/pre_dge',upload.single('pre_dge'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });

      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});

app.post('/api/upload/pre_gene',upload.single('pre_gene'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });

      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});

app.post('/api/upload/pre_cell',upload.single('pre_cell'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });

      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});

app.post('/api/upload/post_dge',upload.single('post_dge'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });

      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});

app.post('/api/upload/post_gene',upload.single('post_gene'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });

      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});

app.post('/api/upload/post_cell',upload.single('post_cell'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });

      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Node.js server is running on port ' + PORT);
});

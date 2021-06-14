'use strict';

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

let server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/DB_NAME', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const schema = new mongoose.Schema({
  name: String,
  img: String,
  level: String,
});

const model = mongoose.model('digimon', schema);

server.get('/', testHandler);
server.get('/apiData', apiDataHandler);
server.post('/addFavorite', addFavoriteHandler);
server.get('/favData', favDataHandler);
server.delete('/deleteFavorite/:name', deleteFavoriteHandler);
server.put('/updateFavorite/:idx', updateFavoriteHandler);

function testHandler(req, res) {
  res.send('hello home');
}

function apiDataHandler(req, res) {
  //   console.log('hello');
  const url = 'https://digimon-api.vercel.app/api/digimon';
  axios.get(url).then((result) => {
    // console.log(result.data);
    res.send(result.data);
  });
}

function addFavoriteHandler(req, res) {
  //   console.log(req.body);
  let item = req.body;
  let fav = new Digimon(item);
  //   console.log(fav);
  model.create(fav);
  res.send(fav);
}

function favDataHandler(req, res) {
  //   console.log('hello');
  model.find({}, (error, favData) => {
    // console.log(favData);
    res.send(favData);
  });
}

function deleteFavoriteHandler(req, res) {
  //   console.log(req.params.name);
  let name = req.params.name;
  model.deleteOne({ name: name }, (error, data) => {
    model.find({}, (error, result) => {
      //   console.log(result);
      res.send(result);
    });
  });
}

function updateFavoriteHandler(req, res) {
  //   console.log(req.params.idx);
  //   console.log(req.body);
  let idx = req.params.idx;
  let { name, img, level } = req.body;
  model.find({}, (error, data) => {
    // console.log(data[idx]);
    data[idx].name = name;
    data[idx].img = img;
    data[idx].level = level;
    // console.log(data[idx]);
    data[idx].save();
    res.send(data);
  });
}

class Digimon {
  constructor(item) {
    this.name = item.name;
    this.img = item.img;
    this.level = item.level;
  }
}

server.listen(PORT, () => {
  console.log('server is listening');
});

require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
var spaceModel = require('./model/space.js');
var fs = require('fs');
var request = require('request');

const IMAGE_PATH='image/';

app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));



const mgDB = `mongodb+srv://${process.env.ID}:${process.env.PASS}@myproject1.rt3op.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
mongoose.connect(mgDB , {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        console.log('MongoDB collection done successfully');
        app.listen(9999);
    }).catch((err) => {
        console.log('Something went wrong. \n Error: ' + err);
    });

  async function saveSpaceData(data) {
    let spaceObject = new spaceModel({
      copyright: data.copyright,
      date: new Date(data.date),
      explanation: data.explanation,
      hdurl: data.hdurl,
      media_type: data.media_type,
      service_version: data.service_version,
      title: data.title,
      url:data.url
    });
    await spaceObject.save();
  }

  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

app.get('/:DATE?', (req, res) => {
  const default_date = req.params.DATE;
  let date = new Date();
  currentDate = default_date ?? `${date.getFullYear()}-${(date.getMonth() + 1)}-${(date.getDate())}`;
  spaceModel.findOne({date: new Date(currentDate)})
      .then( async (result) => {
        if(!result){
          await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}&date=${currentDate}`)
            .then((response) => {
              tempObjectId = 0;
              
              

              if(response.data.media_type == "image") {
                download(response.data.url, 'public/' + IMAGE_PATH + currentDate + '.jpg', function(){
                  // let doc = spaceModel.updateOne({_id: tempObjectId}, {url: IMAGE_PATH + currentDate + '.jpg'});
                  // console.log(doc);
                  let spaceObject = new spaceModel({
                    copyright: response.data.copyright,
                    date: new Date(response.data.date),
                    explanation: response.data.explanation,
                    hdurl: response.data.hdurl,
                    media_type: response.data.media_type,
                    service_version: response.data.service_version,
                    title: response.data.title,
                    url:IMAGE_PATH + currentDate + '.jpg'
                  });
                  spaceObject.save();
                  
                });
              }
              result = response.data;
            })
            .catch(error => {
              console.log(error);
            });
        }
        
        res.render("dashboard", {data:  result, currentDate:  currentDate});
      }).catch((err) => {
        res.send('Something Went Wrong');
      });
  
});


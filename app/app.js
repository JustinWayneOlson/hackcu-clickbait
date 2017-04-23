var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));
var request = require('request');
var API_KEYS = require('./API_KEYS');
var summary = require('node-summary');
var urlService = require('./URLService.js');
var aws = require('aws-sdk');
var machineLearning = new aws.MachineLearning({
    'region': 'us-east-1',
});

app.post('/summarize', function (req, res) {

     if (req.body && !req.body.urlToCheck) {
          return res.status(400).send({
             complete: 'false',
             summary: '',
             url: '',
          });
     }

});

app.post('/checkarticle', function (req, res) {
   if (req.body && !req.body.urlToCheck || !req.body.articleTitle) {
        return res.status(400).send({
           complete: 'false',
           isClickBait: null,
           percentLikely: null,
        });
   }
   var cleanedUrl = urlService.cleanURL({
       urlToClean:req.body.urlToCheck
   });
   var options = {
           MLModelId: API_KEYS.ML_MODEL_ID,
           Record: {
               'Var1': req.body.articleTitle,
               'Var2': cleanedUrl,
           },
           PredictEndpoint: API_KEYS.ML_ENDPOINT,
   };

   machineLearning.predict(options, function (err, data) {
      if (err) {
          return res.status(400).send({
              complete: false,
              isClickBait: null,
              percentLikely: null,
          });
      }
        return res.status(200).send({
           complete: true,
           isClickBait: data.Prediction.predictedValue,
           percentLikely: data.Prediction.predictedScores[data.Prediction.predictedValue],
        });
   });

});


app.listen(3000, function () {
     console.log('Example app listening on port 3000!')
});

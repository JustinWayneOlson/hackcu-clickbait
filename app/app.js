var express = require('express');
var app = express();
var request = require('request');
var API_KEYS = require('./API_KEYS');
var summary = require('node-summary');

app.post('/summarize', function (req, res) {

     if (!req.params.url) {
          return res.status(400).send({
             status: 'error',
             summary: '',
             url: '',
          });
     }

});




app.listen(3000, function () {
     console.log('Example app listening on port 3000!')
});

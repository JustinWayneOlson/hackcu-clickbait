var request = require('request');
var cheerio = require('cheerio');

//URL of base article to be scrape
var url = 'http://www.viralthread.com/aaron-hernandez-wrote-this-message-on-his-forehead-before-committing-suicide/?all'
//regex to parse a url into it's domain
var pattern = /(?:^http:\/\/|^https:\/\/|^){1}(?:([^\.]*)\.\w{2}\.\w{2}|\w*\.([a-zA-Z0-9\-_]*)\.|([a-zA-Z0-9\-_]*)\.)/
var elements = []
var r = request.get(url, function(error, response, html){
   var article_url = this.uri.href;
   if(!error){
      var $ = cheerio.load(html);
      var max =
      {
         'siblings': 0
      };
      $('body').filter(function(){
         $(this).find(':empty').each(function(index,value){
            console.log($(value).siblings().length);
            if($(value).siblings().length > max['siblings'])
            {
               max['siblings'] = $(value).siblings().length;
               max['element'] = $(value);
            }

         });
      });
      console.log($(max['element']));
   }
});


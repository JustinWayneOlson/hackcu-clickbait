var request = require('request');
var cheerio = require('cheerio');
var url = 'http://qklnk.co/nTMJHG'

var pattern = /(?:^http:\/\/|^https:\/\/|^){1}(?:([^\.]*)\.\w{2}\.\w{2}|\w*\.([a-zA-Z0-9\-_]*)\.|([a-zA-Z0-9\-_]*)\.)/
var r = request.get(url, function(error, response, html){
   var article_url = this.uri.href;
   var url_domain = regexURLGroup(pattern, article_url, "");
   if(!error){
      var $ = cheerio.load(html);
      var hrefs = [];
      $('body').filter(function(){
         $(this).find('[href]').each(function(index,value){
            var element = $(value).get(0);
            var target_string = element.attribs['href'];

            var href =
            {
               'domain': regexURLGroup(pattern, target_string, url_domain),
               'class': element.attribs['class'],
               'id': element.attribs['id'],
               'text': element.attribs['text'],
               'innerhtml': element.attribs['innerhtml']
            };

         });
      });

   }
});

function regexURLGroup(pattern, target_string, url_domain){
   var match = pattern.exec(target_string);
   var nodomainPattern = /\/.*/;
   if(match)
   {
      if(match[1])
      {
         return match[1];
      }
      else if(match[2])
      {
         return match[2];
      }
      else if(match[3])
      {
         return match[3];
      }
      else
      {
         return "Invalid Regex String " + target_string;
      }
   }
   else
   {
      var nodomainMatch = nodomainPattern.exec(target_string);
      if(nodomainMatch && nodomainMatch[0]){
         return url_domain
      }
      else{
         return "Invalid Regex String: " + target_string;
      }
   }
}

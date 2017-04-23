var request = require('request');
var cheerio = require('cheerio');
var levenshtein = require('levenshtein');
//URL of base article to be scraped
//var url = 'http://www.viralthread.com/aaron-hernandez-wrote-this-message-on-his-forehead-before-committing-suicide';
//var url = 'http://scribol.com/a/lifestyle/weddings-and-special-occasions/didnt-call-her-after-first-date-33-years-learned-truth/20/'
var url = 'http://scribol.com/a/lifestyle/weddings-and-special-occasions/didnt-call-her-after-first-date-33-years-learned-truth/';


//regex to parse a url into it's domain
var promise = new Promise(function(resolve, reject){
   var r = request.get(url, function(error, response, html) {
      if(error)
      {
         reject(error);
      }
      else
      {
         var content = this;
         resolve(scrape(url, content, html));
      }
   });
});

promise.then(function(url){
   console.log("promise: ", url);
});

function regexURLGroup(pattern, target_string, url_domain) {
    var match = pattern.exec(target_string);
    var nodomainPattern = /\/.*/;
    if (match) {
        if (match[1]) {
            return match[1];
        } else if (match[2]) {
            return match[2];
        } else if (match[3]) {
            return match[3];
        } else {
            return "Invalid Regex String " + target_string;
        }
    } else {
        var nodomainMatch = nodomainPattern.exec(target_string);
        if (nodomainMatch && nodomainMatch[0]) {
            return url_domain
        } else {
            return "Invalid Regex String: " + target_string;
        }
    }
}

function scrape(url, content, html){
        var pattern = /(?:^http:\/\/|^https:\/\/|^){1}(?:([^\.]*)\.\w{2}\.\w{2}|\w*\.([a-zA-Z0-9\-_]*)\.|([a-zA-Z0-9\-_]*)\.)/
        var article_url = content.uri.href;
        var url_domain = regexURLGroup(pattern, article_url, "");
        var deltas = [];
        var hrefs = [];
        var lev, url, endurl;
            var $ = cheerio.load(html);
            var i = 0;

            //find every href in the page and parse out the info

            $('body').filter(function() {
                $(this).find('[href]').each(function(index, value) {
                    //distance between base article url and potential page continuations
                    var element = $(value).get(0);
                    var target_string = element.attribs['href'];
                    lev = new levenshtein(article_url, target_string);

                    var href = {
                        'source_url': article_url,
                        'domain': regexURLGroup(pattern, target_string, url_domain),
                        'attributes': element.attribs,
                        'origin_dif': lev.distance
                    };
                    hrefs.push(href);
                });

            });
            hrefs.sort(function(a, b) {
                return a.origin_dif - b.origin_dif
            });
            if (deltas.length >= 2) {
                deltas.push(Math.abs(hrefs[0]['origin_dif'] - deltas[i - 1]));
                i++;
            } else {
                deltas.push(Math.abs(hrefs[0]['origin_dif']));
                i++;
            }
            var sum = deltas.reduce(function(a, b) {
                return a + b;
            });
            var avg = sum / deltas.length;
            end_url = hrefs[0]['attributes']['href'];
            lev = new levenshtein(article_url, end_url);

            if (lev.distance > avg + (avg * .5)) {
                next_link = false;
            }
            return end_url;

        }

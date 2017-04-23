var rp = require('request-promise');
var cheerio = require('cheerio');
var levenshtein = require('levenshtein');
var co = require('co');
//URL of base article to be scraped
//var url = 'http://www.viralthread.com/aaron-hernandez-wrote-this-message-on-his-forehead-before-committing-suicide';
//var url = 'http://scribol.com/a/lifestyle/weddings-and-special-occasions/didnt-call-her-after-first-date-33-years-learned-truth/20/'
var url = 'http://scribol.com/a/lifestyle/weddings-and-special-occasions/didnt-call-her-after-first-date-33-years-learned-truth/';
var next_link = true;
var visited = [];
co(function* () {
    var scrapedUrl = url;
    while(next_link) {
        var fullResponse = yield Promise.resolve(rp({
            uri: scrapedUrl,
            resolveWithFullResponse: true,
        }));
        scrapedUrl = scrape(url, fullResponse, fullResponse.body);
        console.log(scrapedUrl);
    }
}).catch(error);

function error(err) {
    console.error(err.stack);
}

// //regex to parse a url into it's domain
// var promise = new Promise(function(resolve, reject){
//    var r = request.get(url, function(error, response, html) {
//       if(error)
//       {
//          reject(error);
//       }
//       else
//       {
//          var content = this;
//          resolve(scrape(url, content, html));
//       }
//    });
// });
//
// promise.then(function(url){
//    console.log("promise: ", url);
// });

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
        var article_url = content.request.href;
        var url_domain = regexURLGroup(pattern, article_url, "");
        var deltas = [];
        var hrefs = [];
        var averages = [];
        var lev, url, endurl;
            var $ = cheerio.load(html);
            var i = 0;

            //find every href in the page and parse out the info

            $('body').filter(function() {
                $(this).find('[href]').each(function(index, value) {
                    console.log(visited.indexOf($(value).attr('href')))
                    if(visited.indexOf($(value).attr('href')) > 1)
                     {
                        return true;
                     }
                     else{
                        visited.push(article_url);
                    }
                    console.log('test');
                    //distance between base article url and potential page continuations
                    var element = $(value).get(0);
                    var target_string = element.attribs['href'];
                    lev = new levenshtein(article_url, target_string);
                    averages.push(lev.distance);
                    var href = {
                        'source_url': article_url,
                        'domain': regexURLGroup(pattern, target_string, url_domain),
                        'attributes': element.attribs,
                        'origin_dif': lev.distance
                    };
                    hrefs.push(href);
                    console.log(hrefs);
                });

            });
             var sum = averages.reduce(function(a, b) {
                 return a + b;
             var avg = sum / averages.length;

             /*hrefs.sort(function(a, b) {
             });                                           return a.origin_dif - b.origin_dif
             var avg = sum / deltas.length;            });
            if (deltas.length >= 2) {
                deltas.push(Math.abs(hrefs[0]['origin_dif'] ));
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

            var weightedAvg = avg ;
            console.log(lev.distance, " ", weightedAvg);*/
             console.log(lev.distance," ",avg)    ;
            if (avg > (hrefs[i]['attributes']['origin_dif']*1.2))
            {
                next_link = false;
            }
            console.log(end_url)     ;
            return end_url;

        });
}

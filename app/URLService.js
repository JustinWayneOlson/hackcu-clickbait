/**
 * Clean the URL to the same way we had it going for our ML model
 * [string] args.urlToClean
 */
module.exports.cleanURL = function cleanURL (args) {
    if (!args.urlToClean) {
        return '';
    }
    var regex = new RegExp('(?:^http:\/\/|^https:\/\/|^){1}(?:([^\.]*)\.[a-zA-Z0-9\-_]{2}\.[a-zA-Z0-9\-_]{2}|[a-zA-Z0-9\-_]*\.([a-zA-Z0-9\-_]*)\.|([a-zA-Z0-9\-_]*)\.)');
    var match = regex.exec(args.urlToClean);
    if (match.length && match[1]) {
        return match[1];
    }
    return '';
};
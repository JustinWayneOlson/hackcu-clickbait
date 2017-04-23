const facebook_clickbait = function(node) {

  const chunks = [...node.getElementsByClassName('userContent')];
  var arr = [];
  for (var i=0; i < chunks.length; i++){
    var temp = chunks[i].parentNode.children; //.childNodes
    if (temp.length >= 3){ // count the siblings
      arr.push(chunks[i].parentNode);
    }
  }
  // parent contains the three components -- user content, header, and image
  var counter = 0;
  arr.forEach(function(el) {
    //var children = el.childNodes;
    // specific class name for the article image links
    var image = el.getElementsByClassName('mbs _6m6 _2cnj _5s6c'); 
    //var links = image[counter].getElementsByTagName('a');
    var links = image[counter].getElementsByTagName('a')[0];
    var headline = links.textContent;
    counter++;
    for (var i = 0; i < links.length; i++) {
        var link = (links[i].innerHTML);
    }
    
    // ajax request
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
    if (request.readyState === 4 && (request.status === 200)) { // completed status code
      // reponse from request
      console.log(request.responseText);
      var data = JSON.parse(request.responseText);

        var clickbait = data.isClickBait; // returns 0 or 1
        var percent = data.percentCertainty; // how certain it is in its result
        if(clickbait===false){
          let html = "<div> <ul style='position:absolute;top:30px;right:10px;padding:5px;font-size:12px;line-height:1.8;background-color:#03ad3c;color:#fff;border-radius:5px'> Not Clickbait, "+percent+"% certain<button type='button' id='button1'> summary </button> </ul> </div>";
          //
          el.insertAdjacentHTML('afterend', html);
          button1.addEventListener("click", function(){window.location.replace(link);});
        }
        else if(clickbait===true){
          let html = "<div> <ul style='position:absolute;top:30px;right:10px;padding:5px;font-size:12px;line-height:1.8;background-color:#d10c2d;color:#fff;border-radius:5px'>This is Clickbait, "+percent+"% certain<button type='button' id='button2'> summary </button> </ul> </div>";
          // <button onclick="location.href = 'http://smmry.com/'" type="button" id="button2">summary</button> 
          el.insertAdjacentHTML('afterend', html);
          button2.addEventListener("click", function(){window.location.replace(link);});
        } 

      }
        
       
  };

  //var jsontosend = "urlToCheck=" + link+ "&articleTitle=" +headline; 
  request.open("POST", "/checkarticle?urlToCheck="+link+"&articleTitle="+headline, true);
  request.send();
  });

};

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // ELEMENT_NODE
                facebook_clickbait(node);
            }
        });
    });
});

const config = { attributes: false, childList: true, characterData: false, subtree: true }

observer.observe(document.body, config);

facebook_clickbait(document.body);

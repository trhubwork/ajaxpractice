
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // create the variables for the request

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    // create a jQuery object to inject into html
    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';

    // Load streetview
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // NYTimes AJAX request
      // create var for nytimesUrl to direct json query

    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=9bbcd5ba9c3c49d5acf896090a47b2f8'
    $.getJSON( nytimesUrl, function(data) {

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
          var article = articles[i];
            $nytElem.append('<li class="article">'+
              '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
              '<p>' + article.snippet + '</p>' +
          '</li>');
        };

    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });


    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;

};

$('#form-container').submit(loadData);


// Wikipedia AJAX request goes here
/* var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

//query&titles=Main%20Page&prop=revisions&rvprop=content&format=json'

  $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    // jsonp: "callback",
      success: funtion( response ) {
        var articleList = response[1];

          for (var i = 0; i < articleLIst.length; i++) {
            articleStr = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
          };

          clearTimeout(wikiRequestTimeout);
        }
    }); */


/* From jQuery.getJSON()
 var items = [];
$.each( data, function( key, val ) {
  items.push( "<li id='" + key + "'>" + val + "</li>" );
});

$( "<ul/>", {
  "class": "my-new-list",
  html: items.join( "" )
}).appendTo( "body" ); */

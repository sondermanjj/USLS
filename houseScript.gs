var currentSpringID = "11RbAtFD0i9X0xNG1TNhdeBODukXBb9prOYKamrJCnS4";

var tab = "1";

//URL for retrieving data from sheets directly as JSON
var url = "https://spreadsheets.google.com/feeds/list/" + currentSpringID + "/" + tab + "/public/values?alt=json";

function doGet() {
  return HtmlService.createTemplateFromFile('House').evaluate();
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

/**
* Retrieves the sheet data from the global URL as a JSON String
* @return JSON String of the sheets data
*/
function getJSON() {
  var json = UrlFetchApp.fetch(url);
  
  var JS = JSON.parse(json.getContentText());
  
  var feed = JS.feed;
  
  var entries = feed.entry;
  
  Logger.log("Length: " + entries.length);
  
  return entries;
}

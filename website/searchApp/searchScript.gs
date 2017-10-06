//ID of the Google spreadsheet being accessed
var fallID = "1JsqgABDi402dddQqja_sMRhaCiMLJueS6pryspANVas";

//URL for retrieving data from sheets directly as JSON
//var url = "https://spreadsheets.google.com/feeds/list/" + currentSpringID + "/" + "1" + "/public/values?alt=json";
var url = "https://spreadsheets.google.com/feeds/list/" + fallID + "/" + getWebsiteSheetLocation(fallID).toString() + "/public/values?alt=json";

/**
* Tells the script how to serve the page when a GET request is made
* @return HtmlOutput object containing the HTML to be displayed
*/
function doGet(e) {
  var params = JSON.stringify(e);
  var apphtml = HtmlService.createTemplateFromFile('website/searchApp/Base').evaluate();
  return apphtml;
}

function doPost(e){
}

/**
* Finds the location of the Website Info in the current spreadsheet
* @param id ID for the spreadsheet
* @return integer representing the location of the website sheet
*/
function getWebsiteSheetLocation(id){
  var spreadSheet = SpreadsheetApp.openById(id);
  var websiteSheet = spreadSheet.getSheetByName("Website Info");
  var sheetId = websiteSheet.getIndex().toFixed(0);
  return sheetId;  
}

/**
* Creates an HTML template from the file pointed to so that it can be included in other pages
* @param filename Name of the HTML file to be generated as a template
* @return partial HTML template of the page passed in
*/
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
  Logger.log(JS);
  
  var feed = JS.feed;
  
  var entries = feed.entry;

  return entries;
}

/**
* Retrieves the sheet data using the global spreadsheet ID
* @return sheet data as a 2D array of columns and rows
*/
function getData() {
  return SpreadsheetApp.openById(spreadsheetID).getActiveSheet().getDataRange().getValues();
}

/**
*
*/



  


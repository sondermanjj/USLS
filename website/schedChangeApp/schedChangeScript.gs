//ID of the Google spreadsheet being accessed
var fallID = "1JsqgABDi402dddQqja_sMRhaCiMLJueS6pryspANVas";
var testID = "1dFD0r5HK5p6zTFse2yIZvbwBB6RmKxw_XmfwPF46Dzs"
var tab = "1";

//URL for retrieving data from sheets directly as JSON
var schedURL = "https://spreadsheets.google.com/feeds/list/" + testID + "/" + getWebsiteSchedChangeSheetLocation(testID).toString() + "/public/values?alt=json";

/**
* Tells the script how to serve the page when a GET request is made
* @return HtmlOutput object containing the HTML to be displayed
*/
function doGet(e) {
  var params = JSON.stringify(e);
  var apphtml = HtmlService.createTemplateFromFile('website/schedChangeApp/Base').evaluate();
  var paramhtml = HtmlService.createHtmlOutput(params);
  
  Logger.log(params);
  
  return apphtml;
}

/**
* Finds the location of the Website Info in the current spreadsheet
* @param id ID for the spreadsheet
* @return integer representing the location of the website sheet
*/
function getWebsiteSchedChangeSheetLocation(id){
  console.log("Getting Schedule Changes from sheets...");
  var spreadSheet = SpreadsheetApp.openById(id);
  var websiteSheet = spreadSheet.getSheetByName("Schedule Changes");
  var sheetId = websiteSheet.getIndex().toFixed(0);

  return sheetId;  
}

function doPost(e){
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
function getSchedJSON() {
   var json = UrlFetchApp.fetch(schedURL);
  
  var JS = JSON.parse(json.getContentText());
  
  var feed = JS.feed;
  
  var entries = feed.entry;
  
  Logger.log(entries);
   
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
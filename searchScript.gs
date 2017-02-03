//ID of the Google spreadsheet being accessed
var spreadsheetID = "1k3At6EDIUBB7_x7smZwrx7K5gXJOHTpNYD4NzvgS1vE&sheet=2";
var springScheduleSheetID = "1NYBlGkok313R3Fblj4F3L2_g2ZAqDnCVw68yb8lB7RE&sheet=1";
var sampleID = "1qqXWrHK0ncoQJowURzii-rIVPh-hzPKHNuIdSDEaeQY";
var currentSpringID = "11RbAtFD0i9X0xNG1TNhdeBODukXBb9prOYKamrJCnS4";

// URL for retrieving sheets data as JSON using an external site to convert the data to JSON
//var url = "http://gsx2json.com/api?id=" + springScheduleSheetID;

//URL for retrieving data from sheets directly as JSON
var url = "https://spreadsheets.google.com/feeds/list/" + currentSpringID + "/1/public/values?alt=json";

/**
* Tells the script how to serve the page when a GET request is made
* @return HtmlOutput object containing the HTML to be displayed
*/
function doGet() {
  return HtmlService.createTemplateFromFile('Base').evaluate();
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
* Test functions below used solely during development for testing other methods
*/

// Method used to test button to see if HTML can be modified after pressing button
function returnUselessString(){
  var date = new Date();
  return "This is a string: " + date;
}

//Testing to make sure the string matching in the searchName function is working without needing to retrieve input from HTML form
function testSearch(){
  searchName("Betsy Lou");
}

  


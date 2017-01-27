//ID of the Google spreadsheet being accessed
var spreadsheetID = "1qqXWrHK0ncoQJowURzii-rIVPh-hzPKHNuIdSDEaeQY";

// URL for retrieving sheets data as JSON using an external site to convert the data to JSON
var url = "http://gsx2json.com/api?id=" + spreadsheetID;

//URL for retrieving data from sheets directly as JSON
//var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

// Array to contain the matching results for the name being searched
var matchedNames = []

// Integer to test method being called mutiple times
var testCount = 0;

/**
* Tells the script how to serve the page when a GET request is made
* @return HtmlOutput object containing the HTML to be displayed
*/
function doGet() {
  return HtmlService.createTemplateFromFile('Base').evaluate();
}

/**
* Gets the name being searched for, searches the data for that name, and returns the corresponding lunch data
* @param form the form to retrieve the search data from
* @return HTML content containing the information for the name that was searched
*/
function onSearch(form) {
  var results = HtmlService.createTemplateFromFile('Schedule');
  
  var name = form.fullname;
  var json = JSON.parse(getJSON());
  var nameArray = json.name;
  
  return results.evaluate().getContent(); 
}

/**
* Creates an HTML template from the file pointed to so that it can be included in other pages
* @param filename Name of the HTML file to be generated as a template
* @return partial HTML template of the page passed in
*/
function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

// Method used to test button to see if HTML can be modified after pressing button
function returnUselessString(){
  var date = new Date();
  //testCount = testCount + 3;
  //Logger.log(testCount);
  return "This is a string: " + date;
}

// Another method used for testing purposes 
function returnUselessList(){
  return searchName("Betsy Lou");
  //return "<li>List item one</li><li>List item two</li><li>List item three</li>";
}

//Testing to make sure the string matching in the searchName function is working without needing to retrieve input from HTML form
function testSearch(){
  searchName("Betsy Lou");
}

/**
* Searches the JSON data for names that match the name passed into the form
* @param name the name of the student or faculty member being searched for
* @return the array of names that matched the name being searched for
* @return the HTML string containing a list of the data for the name being searched
*/
function searchName(search_name){
  //var name = form.fullname;
  var json = JSON.parse(getJSON());
  Logger.log("JSON: " + json);
  var rowArray = json.rows;
  var arrayLength = json.columns.name.length;
  Logger.log("Row Array: " + rowArray);
  var names = "";
  var htmlString = "";
  for (var i=0; i<arrayLength; i++){
    var name = rowArray[i].name;
    if(name === search_name){
      htmlString += "<li>Name: " + name + "</li>";
      matchedNames.push(name);
    }
    else {
      names += name + " ";
    }  
  }
  Logger.log("HTML: " + htmlString);
  Logger.log("Matched Names: " + matchedNames);
  Logger.log("Names: " + names);
  return htmlString;
  //return matchedNames;
  //return SpreadsheetApp.openById(spreadsheetID).getActiveSheet().getDataRange().getValues();
}

/**
* Same as previous function, but takes entire form in instead of just the name string
*/
function nameSearch(form){
  
  var search_name = form.fullname.value;
  
  var json = JSON.parse(getJSON());
  var rowArray = json.rows;
  var arrayLength = json.columns.name.length;
  var names = "";
  var htmlString = "";
  for (var i=0; i<arrayLength; i++){
    var name = rowArray[i].name;
    if(name === search_name){
      htmlString += "<li>Name: " + name + "</li>";
      matchedNames.push(name);
    }
    else {
      names += name + " ";
    }  
  }
  //return htmlString;
  return "<li>One</li><li>Two</li>";
}

/**
* Gets the global list of matched names
* @return array containing the results that match the name being searched for
*/
function getMatchedNames(){
  return matchedNames;
}

/**
* Retrieves the sheet data from the global URL as a JSON String
* @return JSON String of the sheets data
*/
function getJSON() {
  var json = UrlFetchApp.fetch(url);
  Logger.log(json);
  return json.getContentText();
}

/**
* Retrieves the sheet data using the global spreadsheet ID
* @return sheet data as a 2D array of columns and rows
*/
function getData() {
  return SpreadsheetApp.openById(spreadsheetID).getActiveSheet().getDataRange().getValues();
}

  


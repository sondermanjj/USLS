//ID of the Google spreadsheet being accessed
var spreadsheetID = "1qqXWrHK0ncoQJowURzii-rIVPh-hzPKHNuIdSDEaeQY";

// URL for retrieving sheets data as JSON using an external site to convert the data to JSON
var url = "http://gsx2json.com/api?id=" + spreadsheetID;

//URL for retrieving data from sheets directly as JSON
//var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

// Array to contain the matching results for the name being searched
var matchedNames = []

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

/**
* Searches the JSON data for names that match the name passed into the form
* @param form the form to retrieve the name to search the data for
* @return the array of names that matched the name being searched for
*/
function searchName(form) {
  var name = form.fullname;
  var json = JSON.parse(getJSON());
  var nameArray = json.name;
  var htmlString;
  for (var i=0; i<nameArray.length; i++){
    if(nameArray[i] === str.match(new RegExp(""+name+""))){
      htmlString += "<li> " + nameArray[i] + "</li>";
      matchedNames.push(nameArray[i]);
    }
    else {
    }  
  }
  Logger.log(matchedNames);
  Logger.log("HTML: " + htmlString);
  return matchedNames;
  //return SpreadsheetApp.openById(spreadsheetID).getActiveSheet().getDataRange().getValues();
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
  return UrlFetchApp.fetch(url);
}

/**
* Retrieves the sheet data using the global spreadsheet ID
* @return sheet data as a 2D array of columns and rows
*/
function getData() {
  return SpreadsheetApp.openById(spreadsheetID).getActiveSheet().getDataRange().getValues();
}

  


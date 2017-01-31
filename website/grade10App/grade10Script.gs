//ID of the Google sheet to retrieve data from
var spreadsheetID = "1k3At6EDIUBB7_x7smZwrx7K5gXJOHTpNYD4NzvgS1vE&sheet=2";
var id = "1k3At6EDIUBB7_x7smZwrx7K5gXJOHTpNYD4NzvgS1vE";

// URL for retrieving sheets data as JSON using an external site to convert the data to JSON
var url = "http://gsx2json.com/api?id=" + spreadsheetID;

/**
* Tells the script how to serve the page when a GET request is made
* @return HtmlOutput object containing the HTML to be displayed
*/
function doGet() {
  return HtmlService.createTemplateFromFile('Display').evaluate();
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
  return json.getContentText();
}

function getResults(){
  var resultArray = [];
  var js = JSON.parse(getJSON());
  
  var jsonlength = js.columns.firstname.length;
  
  var rows = js.rows;
  
  for(var i=0; i<jsonlength; i++) {
    var grade = rows[i].gradelevel;
    var studentArray = [];
    if(grade === 10){
      studentArray.push(rows[i].firstname + " " + rows[i].lastname);
      studentArray.push(rows[i].block);
      studentArray.push(rows[i].lunchday);
      studentArray.push(rows[i].lunchtime);
      switch(rows[i].lunchtime){
        case "early":
          studentArray.push(rows[i].lunchtable);
          break;
        case "mid":
          studentArray.push("");
          break;
        case "late":
          studentArray.push(rows[i].house);
          break;
      }
      resultArray.push(studentArray);
    } 
  }
  Logger.log(resultArray);
  return resultArray;
}

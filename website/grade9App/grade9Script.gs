//ID of the Google sheet to retrieve data from
var spreadsheetID = "1k3At6EDIUBB7_x7smZwrx7K5gXJOHTpNYD4NzvgS1vE&sheet=2";
var springScheduleSheetID = "1NYBlGkok313R3Fblj4F3L2_g2ZAqDnCVw68yb8lB7RE&sheet=1";
var currentSpringID = "1Ghj-01z6asJzoyxIGg-OsXxaN2sv09OEwI_L0RFT_Ys";

// URL for retrieving sheets data as JSON 
var url = "https://spreadsheets.google.com/feeds/list/" + currentSpringID + "/1/public/values?alt=json";

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
  
  var JS = JSON.parse(json.getContentText());
  
  var feed = JS.feed;
  
  var entries = feed.entry;
  
  return entries;
}

function getResults(){
  var resultArray = [];
  var js = getJSON();
  
  Logger.log("Length: " + js.length);
  
  var length = js.length;
  
  for(var index=0; index<length; index++){
    var grade = js[index].gsx$gradelevel.$t;
    var studentArray = [];
    if(grade === "9" && js[index].gsx$lunchday.$t !== "I"){
      studentArray.push(js[index].gsx$firstname.$t.replace(/\s/g,'') + " " + js[index].gsx$lastname.$t.replace(/\s/g,''));
      studentArray.push(js[index].gsx$block.$t);
      studentArray.push(js[index].gsx$lunchday.$t);
      studentArray.push(js[index].gsx$eml.$t);
      switch(js[index].gsx$eml.$t){
        case "early":
          studentArray.push(js[index].gsx$table.$t);
          break;
        case "mid":
          studentArray.push("");
          break;
        case "late":
          studentArray.push(js[index].gsx$house.$t);
          break;
      }
      resultArray.push(studentArray);
    }

  }
   Logger.log(resultArray);
  
  return resultArray.sort();
}

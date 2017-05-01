//JSHint verified 4/30/2017 sondermanjj
//ID of the Google spreadsheet being accessed
var currentSpringID = "1Ghj-01z6asJzoyxIGg-OsXxaN2sv09OEwI_L0RFT_Ys";

//Which tab within the sheet to retrieve the data from
var tab = "1";

//URL for retrieving data from sheets directly as JSON
var url = "https://spreadsheets.google.com/feeds/list/" + currentSpringID + "/" + tab + "/public/values?alt=json";

var ADay = [];
var BDay = [];
var CDay = [];
var DDay = [];
var EDay = [];
var FDay = [];
var GDay = [];
var HDay = [];

/**
* Tells the script how to serve the page when a GET request is made
* @return HtmlOutput object containing the HTML to be displayed
*/
function doGet() {
  return HtmlService.createTemplateFromFile('website/facultyApp/Disp').evaluate();
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
* Gathers all data for faculty and sorts them into arrays by lunch day
* @return array of all lunch data for faculty
*/
function getResults(){
 var resultArray = [];
  var js = getJSON();
  
  var length = js.length;
  
  for(var index=0; index<length; index++){
    var grade = js[index].gsx$gradelevel.$t;
    var name = js[index].gsx$firstname.$t.replace(/\s/g,'') + " " + js[index].gsx$lastname.$t.replace(/\s/g,'');
    var block = js[index].gsx$block.$t;
    var day = js[index].gsx$lunchday.$t;
    var eml = js[index].gsx$eml.$t;
    var studentArray = [];
    if(grade === "" && name !== "Advantage Advancement" && day !== "I"){
      studentArray.push(name);
      studentArray.push(block);
      studentArray.push(day);
      studentArray.push(eml);
      var table = "";
      switch(js[index].gsx$eml.$t){
        case "early":
          table = js[index].gsx$table.$t;
          break;
        case "late":
          table = js[index].gsx$house.$t;
          break;
      }
      studentArray.push(table);
      if(studentArray[2] == "A"){
        ADay.push(studentArray);
      }
      else if(studentArray[2] == "B"){
        BDay.push(studentArray);
      }
      else if(studentArray[2] == "C"){
        CDay.push(studentArray);
      }
      else if(studentArray[2] == "D"){
        DDay.push(studentArray);
      }
      else if(studentArray[2] == "E"){
        EDay.push(studentArray);
      }
      else if(studentArray[2] == "F"){
        FDay.push(studentArray);
      }
      else if(studentArray[2] == "G"){
        GDay.push(studentArray);
      }
      else {
        HDay.push(studentArray);
      }
      resultArray.push(studentArray);
    }

  } 
  return resultArray.sort();
}

function getADay(){
  return ADay.sort();
}

function getBDay(){
  return BDay.sort();
}

function getCDay(){
  return CDay.sort();
}

function getDDay(){
  return DDay.sort();
}

function getEDay(){
  return EDay.sort();
}

function getFDay(){
  return FDay.sort();
}

function getGDay(){
  return GDay.sort();
}

function getHDay(){
  return HDay.sort();
}


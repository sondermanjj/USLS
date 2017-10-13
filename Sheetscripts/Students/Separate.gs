//JSHint verified 4/3/2017 sondermanjj

/**
@desc Retrieves the information from Final Student Data to place students
into separate sheets based on house.
@funtional - yes
@author - dicksontc
*/
function splitIntoNewSheets(){

  var docProperties = PropertiesService.getDocumentProperties();
  var properties = docProperties.getProperties();
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.studentData);

  
  var primaryData = primary.getDataRange();
  
  var pValues = primaryData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var pNumColumns = primaryData.getNumColumns();
  
  var lunchTimeColumn = parseInt(properties["Student Lunch Time"]);
  var lunchTableColumn = parseInt(properties["Student Lunch Table"]);
  var fNameColumn = parseInt(properties["Student First Name"]);
  var lNameColumn = parseInt(properties["Student Last Name"]);
  var houseColumn = parseInt(properties["Student House"]);
  var lunchDayColumn = parseInt(properties["Student Lunch Day"]);
  var gradeColumn = parseInt(properties["Student Grade Level"]);
  
  doHouseSheets(pValues,pNumRows, properties);
  doTableSheets(pValues,pNumRows, properties);
  
}

/**
 * @desc creates a new sheet (or overwrites old one) with the data involved)
 * @param - data[][] - data from a sheet
 *          name - name of the new sheet
 * @functional - yes
 * @author - sondermanjj
 */
function createNewSheet(data, name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ts = sheet.getSheetByName(name); //Target sheet
  
  if (ts === null) {
    sheet.insertSheet(name);
    ts = sheet.getSheetByName(name); //Target sheet
  }
  ts.clearContents();
  
  //set the target range to the values of the source data
  ts.getRange(1, 1, data.length, data[0].length).setValues(data);
}

/**
@desc Creates the data needed to create a sheet for each of the houses
@params - lunchTimeColumn - index of column with lunch time info
          lunchTableColumn - index of column with lunch table info
          fNameColumn - index of column with first name
          lNameColumn - index of column with last name
          houseColumn - index of column with house info
          lunchDayColumn - index of column with lunch day info
          gradeColumn - index of column with grade info
          pValues - the student data
          pNumRows - number of rows of data to be parsed
@funtional - yes
@author - dicksontc
*/
function doHouseSheets(pValues,pNumRows, properties){
  
  var lunchTimeColumn = parseInt(properties["Student Lunch Time"]);
  var lunchTableColumn = parseInt(properties["Student Lunch Table"]);
  var fNameColumn = parseInt(properties["Student First Name"]);
  var lNameColumn = parseInt(properties["Student Last Name"]);
  var houseColumn = parseInt(properties["Student House"]);
  var lunchDayColumn = parseInt(properties["Student Lunch Day"]);
  var gradeColumn = parseInt(properties["Student Grade Level"]);
  
  var academy = [];
  var crest = [];
  var arrow = [];
  var ledger = [];
  var rowZero = ["First Name", "Last Name", "Grade", "Lunch Day", "EML", "Table", "House"];
  academy.push(rowZero);
  crest.push(rowZero);
  arrow.push(rowZero);
  ledger.push(rowZero);
  
  for(var i = 0; i < pNumRows; i++){
    var house = pValues[i][houseColumn];
    var fName = pValues[i][fNameColumn];
    var lName = pValues[i][lNameColumn];
    var day = pValues[i][lunchDayColumn];
    var grade = pValues[i][gradeColumn];
    var time = pValues[i][lunchTimeColumn];
    var table = pValues[i][lunchTableColumn];
    
    var temp = [fName, lName, grade, day, time, table, house];
    if(house == "Academy")
      academy.push(temp);
    else if(house == "Ledger")
      ledger.push(temp);
    else if(house == "Arrow")
      arrow.push(temp);
    else if(house == "Crest")
      crest.push(temp);
  }
  
  createNewSheet(academy, "Academy");
  createNewSheet(ledger, "Ledger");
  createNewSheet(crest, "Crest");
  createNewSheet(arrow, "Arrow");
}

/**
@desc Creates the data needed to create a sheet for each of the lunch tables
@params - lunchTimeColumn - index of column with lunch time info
          lunchTableColumn - index of column with lunch table info
          fNameColumn - index of column with first name
          lNameColumn - index of column with last name
          houseColumn - index of column with house info
          lunchDayColumn - index of column with lunch day info
          gradeColumn - index of column with grade info
          pValues - the student data
          pNumRows - number of rows of data to be parsed
@funtional - yes
@author - dicksontc
*/
function doTableSheets(pValues, pNumRows, properties){
  
  var lunchTimeColumn = parseInt(properties["Student Lunch Time"]);
  var lunchTableColumn = parseInt(properties["Student Lunch Table"]);
  var fNameColumn = parseInt(properties["Student First Name"]);
  var lNameColumn = parseInt(properties["Student Last Name"]);
  var houseColumn = parseInt(properties["Student House"]);
  var lunchDayColumn = parseInt(properties["Student Lunch Day"]);
  var gradeColumn = parseInt(properties["Student Grade Level"]);


  var tables = [];
  var rowZero = ["First Name", "Last Name", "Grade", "Lunch Day", "EML", "Table", "House"];
  for(var k = 0; k < 19; k++){
    tables[k] = [];
    tables[k].push(rowZero);
  }
  for(var i = 0; i < pNumRows; i++){
    var house = pValues[i][houseColumn];
    var fName = pValues[i][fNameColumn];
    var lName = pValues[i][lNameColumn];
    var day = pValues[i][lunchDayColumn];
    var grade = pValues[i][gradeColumn];
    var time = pValues[i][lunchTimeColumn];
    var table = pValues[i][lunchTableColumn];
    var temp = [fName, lName, grade, day, time, table, house];
    
    if(time == "early"){
      tables[table-1].push(temp);
    }
  } 
  
  for(i = 0; i < 19; i++){
    var name = "Table " + (i+1);
    createNewSheet(tables[i], name);
  }
}
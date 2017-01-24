/**
Class dedicated to the sorting of the teachers. Plan is to create seperate list with all 
the tables necessary for the early days. Then go through the list of people applicable to early 
and wipe all the ones who do not apply. Once we have leftovers, first get all the DOD's and give
them the table #1. Then get the "Fixed" entries and put them in for the tables for each week.Finally
we'll have to move a certain number of Free Mid or Late into the early column, and assign them to the
remaining tables

TODO: Later on, could integrate having teachers with large amount of early days getting the same table,
say any who have over 5 early days.

Later could try to have a "Maximum" amount of days they want, will flesh out the form later.
For now assume Sheet Format
First Name	Last Name	Letter-Day	Lunch Preference	Lunch Assignment	Section

*/

function doItAll() {
  Logger.log("Program Started");
  populateTableList();
  addTeachersToTableList();
  
}

var numberOfTables = 19;
var letterDays = ["A","B","C","D","E","F","G","H"];
var dayNumbers = [3,7,4,8,1,5,2,6];
var randomSeed = 33;
var earlyCount = 0;

function addTeachersToTableList() {
  
  Logger.log("Adding teachers begun");
  
  var tableList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tableList");
  var teacherList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Formatted Request Sheet")
  var teacherRow;
  
  tableList.getRange(1, 1, 500).setBackground("white");
  
  Logger.log("Spreadsheets retrieved");
  
  teacherList.sort(1);
  
  
  //Reset tables assigned to 0
  teacherList.getRange(2, 8, teacherList.getLastRow()-1, 1).setValue(0);
  teacherList.getRange(2, 9, teacherList.getLastRow()-1, 1).setValue(null);
  
  Logger.log("Spreadsheet 0 values assigned");
  
  var allTeachersLunch = teacherList.getRange(1, 5, teacherList.getLastRow(), 1).getValues();
  var earlyTeachersRows = [];
  //Assign random numbers to all the early teachers
  var lastRow = teacherList.getLastRow();
  for (var i = 1; i <= lastRow; i++) {
    if (allTeachersLunch[i] == "early") {
      earlyTeachersRows.push(i+1);
      earlyCount++;
    }
  }
  
  Logger.log("All early teachers row numbers collected");
  
  for (var i = 0; i < earlyTeachersRows.length;i++) {
    teacherList.getRange(earlyTeachersRows[i], 9).setValue(Math.random()*100);
  }  
  
  Logger.log("Random numbers set and put in");
  //First go through and get the DOD's and assign them to the first tables
  
  teacherList.sort(9);
  teacherRow = teacherList.getRange(1, 1, earlyCount, 8).getValues();
  
  Logger.log("Early teachers values retrieved");
  var tablesAssigned = []; 

  for (var t = 0; t < 8; t++) {
    for (var i = 0; i < earlyCount; i++) {
      if (teacherRow[i][2]==letterDays[t] && teacherRow[i][3]=="DOD") {
        teacherList.getRange(i+1, 8).setValue((teacherList.getRange(i+1, 8).getValue())+1);
        teacherRow[i][7]++;
        var teacherValues = teacherList.getRange(i+1, 1, 1, 5).getValues();
        tableList.getRange(((t * 19)+2), 1, 1, 5).setValues(teacherValues);
        tablesAssigned[(t * 19)+2] = 1;
      }
    }
  }
  
  Logger.log("DOD's inserted");
  //reset values as we've changed some values
  
  var startingRow = 0;
  
  for (var t = 0; t < earlyCount; t++) {
    startingRow = -5;
    if (teacherRow[t][7]=="0") {
      Logger.log("Assigning "+teacherRow[t][0]);
      for (var i = 0; i< 8; i++) {
        if (teacherRow[t][2] == letterDays[i]) {
          startingRow = (i*19)+2;
       //   Logger.log(teacherRow[t][2] + " : " + letterDays[i]);
        }
      }
      for (var z = 0; z < 19; z++) {
        if (tablesAssigned[z+startingRow] != "1") {
          teacherList.getRange(t+1, 8).setValue((teacherList.getRange(t+1, 8).getValue())+1);
          teacherRow[t][7]++;
          var teacherValues = teacherList.getRange(t+1, 1, 1, 5).getValues();
          tableList.getRange((startingRow+z), 1, 1, 5).setValues(teacherValues);
          tablesAssigned[startingRow+z] = 1;
          z = 25;
        }
      }
    }
  }
  
  Logger.log("Other teachers sorted into place");
  
  //Then highlight any empty spaces and count em up.
  var tableLastRow = tableList.getLastRow();
  Logger.log("TableRows: "+ tableLastRow);
  var emptyCount = 0;
  var tableRows = tableList.getRange(2, 1, tableLastRow).getValues();
  for (var r = 0; r < tableLastRow; r++) {
    Logger.log(r + ": "+tableRows[r][0]);
    if (tableRows[r][0] == "") {
      Logger.log("Color Found");
      emptyCount++;
      tableList.getRange(r+2, 1, 1).setBackground("red");
    }
  }r
  
  tableList.getRange(1, 8).setValue("Empty Slots");
  tableList.getRange(2, 8).setValue(emptyCount);

  
  Logger.log("Empty Spots marked");
  
  //then assign random numbers to the teachers and sort first by the day (early middle late) and then
  //by the random number. Just start going down and assigning tables for the classes for early, each time
  //adding in the information to table list. Will check each time if it says teaching, but will assign the 
  //FREE and course lunches first.
}

/**
Place the teacherData in the requested sheet (Should be 
*/
function PlaceTeacher(sheet, teacherData) {
  
}

function populateTableList() {
  createNewSheet(null, "tableList")
  var tableList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tableList")
  tableList.getDataRange().getCell(1, 1).setValue("First Name");
  
  addColumn("Block", tableList);
  addColumn("Letter Day", tableList);
  addColumn("Lunch Preference", tableList);
  addColumn("Lunch", tableList);
  addColumn("Table", tableList);
  
  
  //Then populate the tableList with the letter day and table #'s, 19 tables to each day.
  
  for (var i = 0; i<8;i++) {
    rowNumber = 2+(i*numberOfTables);
    tableList.getRange(rowNumber, 3, numberOfTables).setValue(letterDays[i]);
  }
  
  for (var i = 2; i <= ((numberOfTables*8)+1); i++) {
    tableList.getRange(i, 6).setValue(((i-2)%numberOfTables)+1);
  }
}

//Handles adding a teacher to the side effect
function addTeacher(teacherRow) {
  
}

/**
@desc creates a new sheet (or overwrites old one) with the data involved)
@Functional YES
*/
function createNewSheet(data, name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ts = sheet.getSheetByName(name) //Target sheet
  if (ts == null) {
    sheet.insertSheet(name);
    ts = sheet.getSheetByName(name); //Target sheet
  }
  ts.clearContents()
  
  //set the target range to the values of the source data
  if (data != null) {
    ts.getRange(1, 1, data.length, data[0].length).setValues(data);
  }
}

/**
@desc adds a new column at the end of the sheet, with the name in first entry if it does not already exist
@Functional YES
*/
function addColumn(name, sheet) {
  var columns = sheet.getDataRange();
  var numColumns = sheet.getDataRange().getNumColumns();
  var values = columns.getValues();
  var exists = false;
  
  for (var i = 0; i <= numColumns - 1; i++) {
    var column = values[0][i];
    if (column == name) {
      exists = true;
    }
  }
  if (!exists) {
    var row = 1
    var newColumn = numColumns + 1;
    var cell = sheet.getRange(row, newColumn);
    cell.setValue(name);
  }
}

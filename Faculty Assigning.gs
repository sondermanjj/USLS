/**

Class dedicated to the sorting of the teachers. Plan is to create seperate list with all 
the tables necessary for the early days. Then go through the list of people applicable to early 
and wipe all the ones who do not apply. Once we have leftovers, first get all the DOD's and give
them the table #1. Then get the "Fixed" entries and put them in for the tables for each week. Finally 
Distribute remaining teachers randomly where the teacher has no course or is FREE, doing it so each 
has at least one lunch. Be as fair as possible.

Later could try to have a "Maximum" amount of days they want, will flesh out the form later.
For now assume Sheet Format
First Name	Last Name	Letter-Day	Lunch Preference	Lunch Assignment	Section

*/

var numberOfTables = 17;
var letterDays = ["A","B","C","D","E","F","G","H"];

function addTeacherstoTableList() {
   
  var tableList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tableList")
   
  
}

function populateTableList() {
  createNewSheet(null, "tableList")
  var tableList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tableList")
  tableList.getDataRange().getCell(1, 1).setValue("First Name");
  
  addColumn("Last Name", tableList);
  addColumn("Letter Day", tableList);
  addColumn("Lunch Preference", tableList);
  addColumn("Assignment", tableList);
  addColumn("Table", tableList);
  
  
  //Then populate the tableList with the letter day and table #'s, 17 tables to each day.
  
  for (var i = 0; i<8;i++) {
  rowNumber = 2+(i*numberOfTables);
  tableList.getRange(rowNumber, 3, numberOfTables).setValue(letterDays[i]);
  }
  
  for (var i = 2; i <= ((numberOfTables*8)+1); i++) {
  data = tableList.getRange(i, 6).setValue(((i-2)%17)+1);
  }
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

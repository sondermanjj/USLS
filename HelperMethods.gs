/**
 * @desc - Gets a list of all the sheets in the current Spreadsheet
 * @return - html code to list all the sheets as options for a drop down
 * @functional - IN PROEGSS
 * @author - hendersonam
 */
function getSheetList(){
  var sheets = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheets();
    
  var sheetList = '';
  var length = sheets.length();
  for (var i = 0; i < length; i++) {
    sheetList += "<option value=" + sheets[i].getName() + ">" + sheets[i].getName() + "</option>";
    return sheetList;    
  }            
}

/**
 * @desc creates a new sheet (or overwrites old one) with the data involved)
 * @param - array[][] - data from a sheet
 *          string - name of the new sheet
 * @functional - yes
 * @author - sondermanjj
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
  ts.getRange(1, 1, data.length, data[0].length).setValues(data);
}

/**
 * @desc - adds a column to a given sheet
 * @param - string - name of the column to add
 *          sheet - sheet which needs the column
 * @functional - YES
 * @author - sondermanjj
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

/**
 * @desc - deletes a column from a given sheet
 * @param - string - name of the column to delete
 *          sheet - sheet which contains the column
 * @functional - YES
 * @author - sondermanjj
 */
function deleteColumn(name, sheet) {
  var columns = sheet.getDataRange();
  var numColumns = columns.getNumColumns();
  var values = columns.getValues();
  
  for (var i = 0; i <= numColumns - 1; i++) {
    var column = values[0][i];
    if (column == name) {
      sheet.deleteColumn((parseInt(i)+1));
    }
  }
}
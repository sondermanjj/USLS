//JSHint verified 11/10/2017 dicksontc
var dropdownhtml;

/**
*
*/
function getDropdownHTML(){
  return dropdownhtml;
  }


/**
 * @desc - Gets a dropdowon of all the headers for the Final Student Data sheet
 * @return - String(HTML) - HTML for a dropdown list of headers
 * @author - hendersonam
 */
function getDropdownList() {
  var docProperties = PropertiesService.getDocumentProperties();
  var properties = docProperties.getProperties();
  var list = getListOfColumns(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.studentData).getDataRange().getValues());
  return getHTMLDropdown(list);
}

/**
* @desc - checks if a sheet with the given name exists in the current spreadsheet
* @param - name of the sheet to check
* @return - bool indicating whether the sheet exists or not
* @author - clemensam
*/
function sheetExists(name){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if(sheet !== null){
    return true;
  }
  else {
    return false;
  }
}

function getListOfSheetNames() {
  var list = [];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for(var i = 0; i < sheets.length; i++) {
    list.push(sheets[i].getName());
  }
  return list;
}

/**
* @desc - opens a ui to display a message to the user
* @param - string message to be displayed in the popup
* @author - clemensam
*/
function showMessage(message){
  var ui = SpreadsheetApp.getUi();
  ui.alert(message);
}

/**
 * @desc - Gets a dropdowon of all the headers for the Final Student Data sheet
 * @param - Object[] - Array of header names
 * @return - String(HTML) - HTML for a dropdown list of headers
 * @author - hendersonam
 */
function getHTMLDropdown(list) {
  dropdownhtml = "<option value=\"All\">All</option>";
  for(var i = 0; i < list.length; i++) {
    dropdownhtml += "<option value=\"" + list[i] + "\">" + list[i] + "</option>";
  }
  return dropdownhtml;
}

/**
 * @desc - Sorts the given sheet by the list of sorts given
 * @param - Sheet - Sheet to sort
 *          Object[] - Array of header names to sort by in the order given
 * @author - hendersonam
 */
function sortSheetBy(sheet, sorts) {

  if (sorts === null) {
    SpreadsheetApp.getUi().alert("No sorts given!");
    return null;
  }
  if (sheet === null) {
    SpreadsheetApp.getUi().alert("That sheet does not exist, cannot be sorted!");
    return null;
  }
  
  var values = sheet.getDataRange().getValues();
  var headers = getListOfColumns(values);
  
  for (var i = 0; i < sorts.length; i++) {
    var column = getColumnIndex(headers, sorts[i]);
    sheet.sort(column+1);
  }
}

/**
 *
 * @author - clemensam
 */
function searchSheet(filter, column, sheetName){
  var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var index = 0;

  for(index; index < values.length; index++){
    if(values[index].toString().search(filter) > 0){
    }
  }
}

/**
 * @desc - Searches the Final Student Data and hides all rows that do not contain the filter string
 * @param - String - String to search for
 * @author - hendersonam
 */
function hideValues(filter, column, sheetName) {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var map;

  if( column == "All") {
    map = searchAll(filter, sheetName);
  } else {
    map = searchColumn(filter, column, sheetName);
  }
  for (var i in map) {
    sheet.hideRows(i, map[i]);
  }
}

/**
 * @desc - Searches all the Final Student Data for rows that do not contain the filter string
 * @param - String - String to search for
 * @author - hendersonam
 */
function searchAll(filter, sheetName) {
  var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var count = 0;
  var index = 0;  
  var map = {};
  

  for (var i = 1; i <= values.length; i++) { 
    while ( i <= values.length && (values[i-1].toString().toLowerCase().search(filter) == -1 && 
                                   values[i-1].toString().toLowerCase().search("first name") == -1)) {
      if ( count === 0) {
        index = i;
      }
      count++;
      i++;
    }
    if ( count > 0) {
    map[index] = count;
    count = 0;
    }
  }
  return map;
}

/**
 * @desc - Searches the given column for rows that do not contain the filter string
 * @param - String - String to search for
 * @author - hendersonam
 */
function searchColumn(filter, column, sheetName) {
  var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();
  var columnIndex = getColumnIndex(getListOfColumns(values), column);
  var count = 0;
  var index = 0;  
  var map = {};

  for (var i = 1; i <= values.length; i++) { 
    while ( i <= values.length  && (values[i-1][columnIndex].toString().toLowerCase().search(filter.toString().toLowerCase()) == -1 &&
     	values[i-1][columnIndex].toString().toLowerCase().search(column.toString().toLowerCase()) == -1)) {
      if ( count === 0) {
        index = i;
      }
      count++;
      i++;
    }
    if ( count > 0) {
    map[index] = count;
    count = 0;
    }
  }
  return map;
}

/**
 * @desc - Shows all rows in case some are currently hidden
 * @author - hendersonam
 */
function showAllValues() {
 var sheet = SpreadsheetApp.getActiveSheet();
 var values = sheet.getDataRange().getValues();
  
 
  sheet.showRows(1, values.length);
}

/**
  * @desc - Gets the index of the column in the given data
  * @param - Object[][] - Values to search through
  *          String - Name of the column
  * @return - Int - Index of the column in the given Array
  * @author - hendersonam
  */
function getColumnIndex(values, name) {
  var index;
  for( var j = 0; j < values.length; j++) {
      if (values[j].toString().toLowerCase() == name.toString().toLowerCase()) {
        index = j ;
      }
    }
  if(index === null ) { SpreadsheetApp.getUi().alert(name + " column does not exist!");}
  return index;
}

/**
 * @desc - Gets a list of the column names and returns them in an array, looking for
 *         the name "First Name" as an indicator that it found the header row
 * @param - Object[][] - 2D Array of data
 * @return - Array[] - List of the column names in the given data
 */
function getListOfColumns(data) {
  var list = [];
	var i, j;
  var row = -1;
  for (i = 0; i < data.length; i++) {
    for(j = 0; j < data[0].length; j++) {
      if(data[i][j] == 'First Name') {
        row = i;
        j = data[0].length;
        i = data.length;
      } 
    }
  }
  if (row == -1) {
    SpreadsheetApp.getUi().alert("There is no 'First Name' column. Please make sure it is spelt exactly as shown.");
  }

  for(j = 0; j < data[row].length; j++) {
    list.push(data[row][j].toString());

  }
  return list;
}

/**
 * @desc - adds a column/columns to the end of a given 2d Array for a Google Sheet
 *         Assumes the header row has 'First Name' somewhere in it
 * @param - Object[][] - 2D Array of values to add the column name to
 *          Array[] - names of the columns to add
 * @functional - YES
 * @author - hendersonam, sondermanjj
 */
function addColumnNames(values, names) {
  var numColumns = values[0].length;
  var exists = false;
  var headerRow;
  var i, j;
  
  for (i = 0; i < values.length; i++) {
    for (j = 0; j < values[0].length; i++) {
      if (values[i][j] == "First Name") {
        headerRow = i;
        i = values.length;
        j = values[0].length;
      }
    }
  }
  
  if (isNaN(headerRow)) {
    SpreadsheetApp.getUi().alert("Could not add a new column because there is no 'First Name' column. Please make sure it is spelt exactly as shown.");
    return null;
  }
  
  for (j = 0; j < names.length; j++) {
    for (i = 0; i < numColumns; i++) {
      var column = values[headerRow][i];
      if (column == names[j]) {
        exists = true;
      }
    }
    
    if (!exists) {
      exists = false;
      values[headerRow][numColumns] = names[j];
      for (var k = 0; k < values.length; k++) {
        if( values[k][numColumns] != values[headerRow][numColumns]){
          values[k][numColumns] = "";
        }
      }
      numColumns += 1;
    }
  }
  return values;
}

function deleteColumnNames(sheet, names) {
  var values = sheet.getDataRange().getValues();
  var numColumns = values[0].length;
  var headerRow;
  var i, j;
  
  for (i = 0; i < values.length; i++) {
    for (j = 0; j < values[0].length; i++) {
      if (values[i][j] == "First Name") {
        headerRow = i;
        i = values.length;
        j = values[0].length;
      }
    }
  }
  
  if (isNaN(headerRow)) {
    SpreadsheetApp.getUi().alert("Could not delete column because there is no 'First Name' column. Please make sure it is spelt exactly as shown.");
    return null;
  }
  for (j = 0; j < names.length; j++) {
    for (i = 0; i < numColumns; i++) {
      var column = values[headerRow][i];
      if (column == names[j]) {
        sheet.deleteColumn(i+1);
        numColumns -= 1;
        values = sheet.getDataRange().getValues();
      }
    }

  }
  values = sheet.getDataRange().getValues();
  return values;
}

/**
 * @desc - returns a function that compares values from a certain column index
 * @param - Int - the index of the column to compare by
 * @return - Function
*/
function compareByColumnIndex(index) {
  return function(a,b){
    if (a[index] === b[index]) {
        return 0;
    }
    else {
        return (a[index] < b[index]) ? -1 : 1;
    }
  };
}

/**
 * @desc - Gets the parameters for the search function in the add-on
 * @param - String - string to search for
 *          String - Column name to search under
 * @return - String - the parameters saved as a comma seperated string
*/
function getSearchParams(filter, column) {
  var sheetName = SpreadsheetApp.getActiveSheet().getName();
  var params = 'search, ' + filter + ', ' + column + ', ' + sheetName;
  return params;
}
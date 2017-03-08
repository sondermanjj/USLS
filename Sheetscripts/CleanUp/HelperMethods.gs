
function getDropdownList() {
  var list = getListOfColumns(getFinalStudentDataValues());
  return getHTMLDropdown(list);
}

function getHTMLDropdown(list) {
  var html = "<option value=\"All\">All</option>";
  for(var i = 0; i < list.length; i++) {
    html += "<option value=\"" + list[i] + "\">" + list[i] + "</option>";
  }
  return html;
}

/**
 * @desc - Searches the Final Student Data and hides all rows that do not contain the filter string
 * @param - String - String to search for
 * @author - hendersonam
 */
function hideValues(filter, column) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Final Student Data");
  if( column == "All") {
    var map = searchAll(filter);
  } else {
    var map = searchColumn(filter, column);
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
function searchAll(filter) {
  var values = getFinalStudentDataValues();
  var count = 0;
  var index = 0;  
  var map = {};
  
  for (var i = 2; i <= values.length; i++) { 
    while ( i <= values.length && values[i-1].toString().toLowerCase().search(filter) == -1 ) {
      if ( count == 0) {
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
function searchColumn(filter, column) {
  var values = getFinalStudentDataValues();
  var columnIndex = getColumnIndex(getListOfColumns(values), column);
  var count = 0;
  var index = 0;  
  var map = {};
  
  for (var i = 2; i <= values.length; i++) { 
  var test = values[i-1][columnIndex];
    while ( i <= values.length && values[i-1][columnIndex].toString().toLowerCase().search(filter) == -1 ) {
      if ( count == 0) {
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
  var values = getFinalStudentDataValues();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Final Student Data");

  sheet.showRows(1, values.length);
}

/**
 * @desc - Returns the data values from the Final Student Data sheet
 * @return Object[][] - the data values
 * @author - hendersonam
 */
function getFinalStudentDataValues() {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Final Student Data")
    .getDataRange()
    .getValues();
  
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
  if(index == null ) { SpreadsheetApp.getUi().alert(name + " column does not exist!");}
  return index;
}

/**
 * @desc - Gets a list of the column names saved in an array
 * @param - Object[][] - 2D Array of data, columns should be in the 0 index
 * @return - Array[] - List of the column names in the given data
 */
function getListOfColumns(values) {
  var list = new Array();
  var row = -1;
  for (var i = 0; i < values.length; i++) {
    for( var j = 0; j < values[0].length; j++) {
      if(values[i][j] == 'First Name') {
        row = i;
      } 
    }
  }
  if (row == -1) {
    SpreadsheetApp.getUi().alert("There is no /'First Name/' column. Please make sure it is spelt exactly as shown.");
  }
  for( j = 0; j < values[row].length; j++) {
    list.push(values[row][j].toString().toLowerCase());
  }
  return list;
}
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
  var properties = PropertiesService.getDocumentProperties();
  var list = getListOfColumns(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData")).getDataRange().getValues());
  return getHTMLDropdown(list);
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
  var values = sheet.getDataRange().getValues();
  var headers = getListOfColumns(values);
  
  for (var i = 0; i < sorts.length; i++) {
    var column = getColumnIndex(headers, sorts[i]);
    sheet.sort(column+1);
  }
}

/**
 * @desc - Searches the Final Student Data and hides all rows that do not contain the filter string
 * @param - String - String to search for
 * @author - hendersonam
 */
function hideValues(filter, column) {

  var properties = PropertiesService.getDocumentProperties()
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData"));

  if( column == "All") {
    map = searchAll(filter);
  } else {
    map = searchColumn(filter, column);
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
  var properties = PropertiesService.getDocumentProperties();
  var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData")).getDataRange().getValues();
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
function searchColumn(filter, column) {
  var properties = PropertiesService.getDocumentProperties();
  var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData")).getDataRange().getValues();
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
 var properties = PropertiesService.getDocumentProperties();
 var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData"));
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

  var row = -1;
  for (var i = 0; i < data.length; i++) {
    for( var j = 0; j < data[0].length; j++) {
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

  for( j = 0; j < data[row].length; j++) {
    list.push(data[row][j].toString());

  }
  return list;
}

/**
 * @desc - Prompts the user to enter the name of a sheet they would like to create
 * @param - String - The message you would like to give the user so they know what the sheet is being created for
 * @functional - yes
 * @author - hendersonam
 */
function promptForNewSheet(msg) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('New Sheet', msg, ui.ButtonSet.OK_CANCEL);

  if (response.getSelectedButton() == ui.Button.OK) {
    var sheetName = response.getResponseText();
    var sheet = ss.getSheetByName(sheetName);
    if(sheet == null) {
      ss.insertSheet(sheetName);
      sheet = ss.getSheetByName(sheetName);
    } else {
      response = ui.alert('Alert!', "That sheet already exists. Are you sure you want to use it?", ui.ButtonSet.YES_NO);
      if (response == ui.Button.YES) {
        ss.deleteSheet(sheet);
        ss.insertSheet(sheetName);
        sheet = ss.getSheetByName(sheetName);
      } else if (response == ui.Button.NO) {
        sheet = promptForNewSheet(msg);
      }
    }
  } 
  
  return sheet;
}

/**
 * @desc - Prompts the user to enter the name of a sheet they would like to use
 * @param - String - The message you would like to give the user so they know what the sheet is being used for
 * @author - hendersonam
 */
function promptForSettingSheetProperty(msg) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Setting Properties...', msg, ui.ButtonSet.OK_CANCEL);

  if (response.getSelectedButton() == ui.Button.OK) {
    var sheetName = response.getResponseText();
    var sheet = ss.getSheetByName(sheetName);
    if(sheet == null) {
      response = ui.alert('Alert!', "That sheet does not exist. Would you like to create it?", ui.ButtonSet.YES_NO);
      if (response == ui.Button.YES) {
        ss.insertSheet(sheetName);
        sheet = ss.getSheetByName(sheetName);
        } else {
        sheet = promptForSettingSheetProperty(msg);
      }
    }
  } 
  
  return sheet;
}

/**
 * @desc - adds a column/columns to a given 2d Array for a Google Sheet
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
  
  for (var i = 0; i < values.length; i++) {
    for ( var j = 0; j < values[0].length; i++) {
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
  
  for ( var j = 0; j < names.length; j++) {
    for (var i = 0; i < numColumns; i++) {
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
  }
}
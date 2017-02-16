/**
 * @desc - Searches the Final Student Data and hides all rows that do not contain the filter string
 * @param - String - String to search for
 * @author - hendersonam
 */
function hideValues(filter) {
  
  var values = getFinalStudentDataValues();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Final Student Data");
  var count = 0;
  var index = 0;    
  var i;
    
  for ( i = 2; i <= values.length; i++) {
      
    while ( i <= values.length && values[i-1].toString().toLowerCase().search(filter) == -1 ) {
      if ( count == 0) {
        index = i;
      }
      count++;
      i++;
    }
    if ( count > 0) {
    sheet.hideRows(index, count);
    count = 0;
    }
  }
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
    for ( var i = 0; i < values[j].length - 1; i++) {
      if (values[j][i].toString().toLowerCase() == name.toString().toLowerCase()) {
        index = i ;
      }
    }
  }
  if(index == null ) { SpreadsheetApp.getUi().alert(name + " column does not exist!");}
  return index;
}
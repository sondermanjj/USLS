/**
 * @desc - Prompts the user to enter the name of the sheet they would like to clean
 * @functional - yes
 * @author - hendersonam
 */
function sheetCleanupPrompt(){

  var cleaned = false;
  
  var ui = SpreadsheetApp.getUi();
  response = ui.prompt('Preparing to clean raw data sheet...', 'Please enter the name of the raw data sheet.\n Note: Sheet names are listed on the bottom tabs.', ui.ButtonSet.OK_CANCEL);
  if(response.getSelectedButton() == ui.Button.OK){
    var sheetName = response.getResponseText();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if(sheet != null){
      cleanedSheet = cleanUp(sheet);
      if (cleanedSheet != null ){
        cleaned = true;
        return cleaned;
      } else {
        return cleaned;
      }  
    } else {
      ui.alert("Whoops! That sheet does not exist. Please check for proper spelling and spacing and try again.");
      sheetCleanupPrompt();
    }
  }
  return cleaned;
}

/**
 * @desc - Takes the relevant data from the RAW file and adds it to the "Final Student Data" sheet
 *         Also, creates the necessary columns that are not included in the RAW file
 * @param - sheet - the RAW sheet file
 * @functional - yes
 * @author - hendersonam
 */
function cleanUp(sheet) {
  
  var oldValues = sheet.getDataRange().getValues();
  var masterList = promptForNewSheet("Please enter the name of the sheet you would like to save the cleaned student information to.");
  
  //Remove irrelevant data
  var newValues = removeIrrelevantData(oldValues);
  
  //Add new columns
  newValues = addColumnNames(newValues, ["Table Head", "Lunch Day", "Lunch Time", "Lunch Table", "House"]);
  
  //Populate the Lunch Day Table
  newValues = populateLunchDay(newValues);
  
  masterList.getRange(1, 1, newValues.length, newValues[0].length).setValues(newValues);
  
  return masterList;
  
}

/**
 * @desc - Searches the data for the 'Block' column and deletes rows that have irrelevant 
 *         data (i.e they have something other than 1,2,3,4,5,6,7,8,E1,G2,A3,C4,F5,H6,B7,D8)
 * @params - Object[][] - 2d Array of values from a Sheet with the old data that needs cleaning
 *           Object[][] - 2d Arrayo of values from a Sheet that will contain the revised values
 * @funtional - yes
 * @author - hendersonam
 */
function removeIrrelevantData(oldValues) {
  
  //Get necessary properties
  var properties = PropertiesService.getDocumentProperties();
  var schoolDays = JSON.parse(properties.getProperty('schoolDays'));
  
  //Create a new array for the cleaned data
  var revisedValues = [];
  
  //Add the column titles to the new data array
  var oldHeaders = getListOfColumns(oldValues);
  revisedValues.push(oldHeaders);
  
  //Get necessary column indices
  var blockColumn = getColumnIndex(oldHeaders, "Block");
  
  //Grab any relevant rows (courses that meet during lunch times)
  //and push them to the new data array
  for (var j = 0; j < oldValues.length - 1; j++) {
    var row = oldValues[j][blockColumn];
    if(schoolDays[row] != null) {
      revisedValues.push(oldValues[j]);
    }
  }
  return revisedValues;
}


/**
 * @desc - Populates the Lunch Day column 
 * @param - Object[][] - 2d Array of values from a Google Sheet 
 * @functional - yes
 * @author - hendersonam
 */
function populateLunchDay(values) {
  
  var properties = PropertiesService.getDocumentProperties();
  var schoolDays = JSON.parse(properties.getProperty('schoolDays'));
  var headers = getListOfColumns(values);
  var blockColumn = getColumnIndex(headers, "Block");
  var lunchDayColumn = getColumnIndex(headers, "Lunch Day");
  
  var badRows = [];

  //Fill in the 'Lunch Day' column according to the corresponding 'Block' data
  for (var j = 0; j < values.length; j++) {
    if(values[j][lunchDayColumn] != "Lunch Day") {
      var day = schoolDays[values[j][blockColumn]];
      if( day === null) {
        badRows.push(j+1);
      } else {
        values[j][lunchDayColumn] = schoolDays[values[j][blockColumn]];
      }
    }
  }
  
  if (badRows.length > 0) {
    SpreadsheetApp.getUi().alert("Error setting lunch days on rows: \n" + badRows);
  }
  
  return values;
}

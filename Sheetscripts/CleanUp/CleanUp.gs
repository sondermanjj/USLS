
/*****************************************************************
      * @desc - Brings up the Schedule Change Prompt
      * @author - hendersonam
  *******************************************************************/
  function showCleanUpPrompt() {
    var html = HtmlService.createTemplateFromFile('Sheetscripts/CleanUp/HTML')
      .evaluate()
      .setHeight(100)
      .setWidth(400);
    SpreadsheetApp.getUi().showModalDialog(html, ' ');
  }

/**
 * @desc - Takes the relevant data from the RAW file and adds it to the "Final Student Data" sheet
 *         Also, creates the necessary columns that are not included in the RAW file
 * @param - sheet - Sheet - the RAW sheet file
 *          newSheet - Sheet - Sheet to save the new student data to
 * @functional - yes
 * @author - hendersonam
 */
function cleanUp(sheetName, newSheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var newSheet = ss.getSheetByName(newSheetName);
  if(sheet == null) {
    SpreadsheetApp.getUi().alert("The Raw Data Sheet cannot be a newly made sheet. It must contain student records provided by administration.");
    return;
  }
  
  if(newSheet == null) {
    ss.insertSheet(newSheetName);
    newSheet = ss.getSheetByName(newSheetName);
  }
  
  var oldValues = sheet.getDataRange().getValues();
  
  var newValues = removeIrrelevantData(oldValues);
  
  newValues = addColumnNames(newValues, ["Table Head", "Lunch Day", "Lunch Time", "Lunch Table", "House"]);
  
  newValues = populateLunchDay(newValues);
  
  newSheet.getRange(1, 1, newValues.length, newValues[0].length).setValues(newValues);
  
  return newSheet;
  
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
  for (var j = 0; j < oldValues.length; j++) {
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

/**
 * @desc - Prompts the user to enter the name of the sheet they would like to clean
 * @functional - yes
 * @author - hendersonam
 */
function sheetCleanupPrompt(){

  var cleanedSheet;
  
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Preparing to clean raw data sheet...', 'Is this the raw student data sheet?', ui.ButtonSet.YES_NO);
  if(response == ui.Button.YES) {
    var sheet = SpreadsheetApp.getActiveSheet();
    setStudentSheet(sheet);
    cleanedSheet = cleanUp(SpreadsheetApp.getActiveSheet().getName());
    //showDialog('clean, ' + SpreadsheetApp.getActiveSheet().getName());
  } else if (response == ui.Button.NO) {
    response = ui.prompt('Preparing to clean raw data sheet...', 'Please enter the name of the raw data sheet.\n Note: Sheet names are listed on the bottom tabs.', ui.ButtonSet.OK_CANCEL);
    if(response.getSelectedButton() == ui.Button.OK){
      var sheetName = response.getResponseText();
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      if(sheet != null){
        setStudentSheet(sheet);
        cleanedSheet = cleanUp(sheetName);
      }
      else {
        ui.alert("Whoops! That sheet does not exist. Please check for proper spelling and spacing and try again.");
      }
    }
  }
  return cleanedSheet;
}

/**
 * @desc - Takes the relevant data from the RAW file and adds it to the "Final Student Data" sheet
 *         Also, creates the necessary columns that are not included in the RAW file
 * @param - sheet - the RAW sheet file
 * @functional - yes
 * @author - hendersonam
 */
function cleanUp(sheetName) {
  
  var oldValues = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();;
  
  var masterList = promptForNewSheet("Please enter the name of the sheet you would like to save the cleaned student information to.");
  
  var newValues = masterList.getDataRange().getValues();
  
   
  //Remove irrelevant data
  newValues = removeIrrelevantData(oldValues, newValues);
 
  //Add New Columns
  newValues = addColumnName(newValues, "Table Head");
  newValues = addColumnName(newValues, "Lunch Day");
  newValues = addColumnName(newValues, "Lunch Time");
  newValues = addColumnName(newValues, "Lunch Table");
  newValues = addColumnName(newValues, "House");

  //Populate the Lunch Day Table
  newValues = populateLunchDay(newValues);

  masterList.clearContents();
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
function removeIrrelevantData(oldValues, newValues) {
  
  //Create a new array for the cleaned data
  var revisedValues = new Array();
  var headers = getListOfColumns(oldValues);
  var blockColumn = getColumnIndex(headers, "Block");
      
  //Add the column titles to the new data array
  revisedValues.push(headers);
  
  //Grab any relevant rows (courses that meet during lunch times)
  //and push them to the new data array
  for (var j = 0; j < oldValues.length - 1; j++) {
    var row = oldValues[j][blockColumn];
    if(row == "1" || row == "2" || 
       row == "3" || row == "4" || 
       row == "5" || row == "6" || 
       row == "7" || row == "8" || 
       row == "E1" || row == "G2" || 
       row == "A3" || row == "C4" || 
       row == "F5" || row == "H6" || 
       row == "B7" || row == "D8") {
      
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
  
  var headers = getListOfColumns(values);
  var blockColumn = getColumnIndex(headers, "Block");
  var lunchDayColumn = getColumnIndex(headers, "Lunch Day");
  
  //Get necessary data 
  var numRows = values.length;
  var numColumns = values[0].length;
  
    //Fill in the 'Lunch Day' column according to the corresponding 'Block' data
  for (var j = 0; j <= numRows - 1; j++) {
    if (values[j][blockColumn] == "1" || values[j][blockColumn] == "E1") {
    
      values[j][lunchDayColumn] = "E";
      
    } else if (values[j][blockColumn] == "2" || values[j][blockColumn] == "G2") {
    
      values[j][lunchDayColumn] = "G";
      
    } else if (values[j][blockColumn] == "3" || values[j][blockColumn] == "A3") {
    
      values[j][lunchDayColumn] = "A";
      
    } else if (values[j][blockColumn] == "4" || values[j][blockColumn] == "C4") {
    
      values[j][lunchDayColumn] = "C";
      
    } else if (values[j][blockColumn] == "5" || values[j][blockColumn] == "F5") {
    
      values[j][lunchDayColumn] = "F";
      
    } else if (values[j][blockColumn] == "6" || values[j][blockColumn] == "H6") {
    
      values[j][lunchDayColumn] = "H";
      
    } else if (values[j][blockColumn] == "7" || values[j][blockColumn] == "B7") {
    
      values[j][lunchDayColumn] = "B";
      
    } else if (values[j][blockColumn] == "8" || values[j][blockColumn] == "D8") {
    
      values[j][lunchDayColumn] = "D";
    }
  }
  
  return values;
}

/**
@desc - On Spreadsheet open, creates the Add-On menu
@functional - yes
@author - hendersonam
*/
function onOpen() {
    var ui = SpreadsheetApp.getUi();
    var mainMenu = ui.createMenu("Personal Add-ons");
    mainMenu.addItem("Clean up RAW data", "startCleanUp");
    mainMenu.addSeparator();
    mainMenu.addToUi();
}

/**
@desc - Prompts the user to enter the name of the sheet they would like to clean
@functional - yes
@author - hendersonam
*/
function startCleanUp() {
   var ui = SpreadsheetApp.getUi();
   var response = ui.prompt('Data Cleanup', 'Please enter the name of the sheet you would like to clean up.', ui.ButtonSet.OK_CANCEL);

   // Process the user's response.
   if (response.getSelectedButton() == ui.Button.OK) {
       var name = response.getResponseText();
       cleanUp(name);
   } else if (response.getSelectedButton() == ui.Button.CANCEL) {
       Logger.log('The user canceled.');
   } else {
       Logger.log('The user clicked the close button in the dialog\'s title bar.');
   }
}


/**
@desc - Takes the relevant data from the RAW file and adds it to the "Final Student Data" sheet
        Also, creates the necessary columns that are not included in the RAW file
@param - name of the RAW data file
@functional - yes
@author - hendersonam
*/
function cleanUp(name) {
  
    //Get active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
    //Get the RAW data sheet and its values
    var raw = spreadsheet.getSheetByName(name);
  
    //Create a new sheet to write the cleaned data to (if it doesn't already exist)
    var masterList = spreadsheet.getSheetByName("Final Student Data");
    if (masterList == null) {
        var values = raw.getDataRange().getValues();
        createNewSheet(values, "Final Student Data");
        masterList = spreadsheet.getSheetByName("Final Student Data");
    }
    
    //Remove irrelevant data
    removeIrrelevantData(raw, masterList);
}




/**
@desc Searches the data for the 'Block' column and deletes rows that have irrelevant 
      data (i.e they have something other than 1,2,3,4,5,6,7,8,E1,G2,A3,C4,F5,H6,B7,D8)
@param - oldSsheet - sheet to clean up
         newSheet - sheet to write to
@funtional - yes
@author - hendersonam
*/
function removeIrrelevantData(oldSheet, newSheet) {
    
    //Get all corresponding data needed (values, number of rows, number of columns)
    var data = oldSheet.getDataRange();
    var values = data.getValues();
    var numRows = data.getNumRows();
    var numColumns = data.getNumColumns();
  
    //Create a new array for the cleaned data
    var newData = new Array();
  
    //Add the column titles to the new data array
    newData.push(values[0]);
  
    //Search for the 'Block' column
    for (var i = 0; i <= numColumns - 1; i++) {
        var column = values[0][i];
        if (column == 'Block') {
          
            //Grab any relevant rows (courses that meet during lunch times)
            //and push them to the new data array
            for (var j = 0; j < numRows - 1; j++) {
                var row = values[j][i];
                if(row == "1" || row == "2" || 
                       row == "3" || row == "4" || 
                       row == "5" || row == "6" || 
                       row == "7" || row == "8" || 
                       row == "E1" || row == "G2" || 
                       row == "A3" || row == "C4" || 
                       row == "F5" || row == "H6" || 
                       row == "B7" || row == "D8") {
                    newData.push(values[j]);
                }
            }
        }
    }
  
    //Add the cleaned data to the given sheet
    newSheet.clearContents();
    newSheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData); 
}

/**
@desc creates a new sheet (or overwrites old one) with the data involved)
@param - data - sheet data to add to the new sheet
         name - the name for the new sheet
@functional - yes
@author - sondermanjj
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


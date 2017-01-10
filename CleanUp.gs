function myFunction() {
  
}

/**
@desc - Takes the relevant data from the RAW file and adds it to the "Final Student Data" sheet
        Also, creates the necessary columns that are not included in the RAW file
@param - name of the RAW data file
@functional - IN PROGRESS
@author - hendersonam
*/
function cleanUp(name) {
  
    //Get active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
    //Get the RAW data sheet and its values
    var raw = spreadsheet.getSheetByName(name);
  
    //Create a new sheet to write the cleaned data to (if it doesn't already exist)
    var masterList = spreadsheet.getSheetByName("Final Student Data");
    if (masterList = null) {
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
@params - sheet - sheet to clean up
          newSheet - sheet to write to
@funtional - IN PROGRESS
@author - hendersonam
*/
function removeIrrelevantData(sheet, newSheet) {
    
    //Get all corresponding data needed (values, number of rows, number of columns)
    var data = sheet.getDataRange();
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
    newSheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData); 
}


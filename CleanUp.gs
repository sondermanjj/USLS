/**
@desc - On Spreadsheet open, creates the Add-On menu
@functional - yes
@author - hendersonam
*/
function onOpen() {
    var ui = SpreadsheetApp.getUi();
  
    //Create a new menu
    var mainMenu = ui.createMenu("Personal Add-ons");
    mainMenu.addItem("Clean up RAW data", "startCleanUp");
    mainMenu.addSeparator();
  
    //Add the menu to the menu bar
    mainMenu.addToUi();
  
    ui.showSidebar(createUI());
}

/**
@desc - Creates the Add-On UI
@functional - yes
@author - hendersonam
*/
function createUI() {
    var app = UiApp.createApplication();
    app.setTitle('Personal Add-Ons');

    //Create the buttons
    var clean = app.createButton("Clean up RAW data");
    var handlerCleanUp = app.createServerHandler('startCleanUp');
    clean.addClickHandler(handlerCleanUp);
  
    //Create the panel to add the buttons to
    var panel = app.createVerticalPanel();
    panel.add(clean);
    
    //Add the panel to the UI
    app.add(panel);
 
    return app;
}

/**
@desc - Prompts the user to enter the name of the sheet they would like to clean
@functional - yes
@author - hendersonam
*/
function startCleanUp() {
   var ui = SpreadsheetApp.getUi();
   //Prompt the user for a sheet name to clean
  var response = ui.prompt('Data Cleanup', 'Please enter the name of the sheet you would like to clean up.\nNote: Sheet names are listed on the bottom tabs.', ui.ButtonSet.OK_CANCEL);

   // Process the user's response.
   if (response.getSelectedButton() == ui.Button.OK) {
       var name = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(response.getResponseText());
       //var name = response.getResponseText();
       if(name != null) {
           cleanUp(name);
       } else {
         ui.alert("Woops! That sheet does not exist. Please check for proper spelling and spacing and try again.");
       }
   } else if (response.getSelectedButton() == ui.Button.CANCEL) {
       Logger.log('The user canceled.');
   } else {
       Logger.log('The user clicked the close button in the dialog\'s title bar.');
   }
   ui.alert("Finished cleaning.");
}


/**
@desc - Takes the relevant data from the RAW file and adds it to the "Final Student Data" sheet
        Also, creates the necessary columns that are not included in the RAW file
@param - the RAW sheet file
@functional - yes
@author - hendersonam
*/
function cleanUp(raw) {
  
    //Get active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
    //Get the RAW data sheet and its values
    //var raw = spreadsheet.getSheetByName(name);
  
    //Create a new sheet to write the cleaned data to (if it doesn't already exist)
    var masterList = spreadsheet.getSheetByName("Final Student Data");
    if (masterList == null) {
        var values = raw.getDataRange().getValues();
        createNewSheet(values, "Final Student Data");
        masterList = spreadsheet.getSheetByName("Final Student Data");
    }
    
    //Remove irrelevant data
    removeIrrelevantData(raw, masterList);
    
    //Add the new, necessary columns
    addColumn("Table Head", masterList);
    addColumn("Lunch Day", masterList);
    addColumn("Lunch Time", masterList);
    addColumn("Lunch Table", masterList);
    addColumn("House", masterList);
  
    //Populate the new columns
    populateLunchDay(masterList);
  
}

/**
@desc - Populates the Lunch Day column 
@param - sheet - given sheet with the lunch day column to populate
@functional - yes
@author - hendersonam
*/
function populateLunchDay(sheet) {
  
    var blockFound = false;
    var lunchDayFound = false;
    //Get necessary data
    var data = sheet.getDataRange();
    var values = data.getValues();
    var numRows = data.getNumRows();
    var numColumns = data.getNumColumns();
  
    //Get the indices for the 'Block' and 'Lunch Day' columns
    for (var i = 0; i <= numColumns - 1; i++) {
        var column = values[0][i];
        if (column == 'Block') {
            blockFound = true;
            var blockColumn = i ;
        }
        if (column == 'Lunch Day') {
            lunchDayFound = true;
            var lunchDayColumn = i ;
        }
    }
  
    //Fill in the 'Lunch Day' column according to the corresponding 'Block' data
    for (var j = 0; j <= numRows - 1; j++) {
      if (values[j][blockColumn] == "1" || values[j][blockColumn] == "E1") {
        data.getCell(j+1,lunchDayColumn+1).setValue("E");
      } else if (values[j][blockColumn] == "2" || values[j][blockColumn] == "G2") {
       data.getCell(j+1,lunchDayColumn+1).setValue("G");
      } else if (values[j][blockColumn] == "3" || values[j][blockColumn] == "A3") {
        data.getCell(j+1,lunchDayColumn+1).setValue("A");
      } else if (values[j][blockColumn] == "4" || values[j][blockColumn] == "C4") {
      data.getCell(j+1,lunchDayColumn+1).setValue("C");
      } else if (values[j][blockColumn] == "5" || values[j][blockColumn] == "F5") {
        data.getCell(j+1,lunchDayColumn+1).setValue("F");
      } else if (values[j][blockColumn] == "6" || values[j][blockColumn] == "H6") {
       data.getCell(j+1,lunchDayColumn+1).setValue("H");
      } else if (values[j][blockColumn] == "7" || values[j][blockColumn] == "B7") {
        data.getCell(j+1,lunchDayColumn+1).setValue("B");
      } else if (values[j][blockColumn] == "8" || values[j][blockColumn] == "D8") {
        data.getCell(j+1,lunchDayColumn+1).setValue("D");
      }
    }
  
    if (!blockFound) {
        SpreadsheetApp.getUi().alert("Could not find the 'Block' column in the first row to fill in the Lunch Days!");
    }
    if (!lunchDayFound) {
        SpreadsheetApp.getUi().alert("Could not find the 'Lunch Day' column in the first row to fill in the Lunch Days!");
    }
}

/**
@desc Searches the data for the 'Block' column and deletes rows that have irrelevant 
      data (i.e they have something other than 1,2,3,4,5,6,7,8,E1,G2,A3,C4,F5,H6,B7,D8)
@params - oldSsheet - sheet to clean up
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
  
    var found = false;
    //Search for the 'Block' column
    for (var i = 0; i <= numColumns - 1; i++) {
        var column = values[0][i];
        if (column == 'Block') {
            found = true;
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
                       row == "B7" || row == "D8" ||
                       row == "Community") {
                    newData.push(values[j]);
                }
            }
        } 
    }
    if (!found) {
        SpreadsheetApp.getUi().alert("Could not find the 'Block' column in the first row to remove irrelevant data!");
    }
  
    //Add the cleaned data to the given sheet
    newSheet.clear();
    newSheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData); 
}

/**
@desc creates a new sheet (or overwrites old one) with the data involved)
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

/**
@desc - adds a column to a given sheet
@param - name - name of the column to add
         sheet - sheet which needs the column
@functional - YES
@author - sondermanjj
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
@desc - deletes a column from a given sheet
@param - name - name of the column to delete
         sheet - sheet which contains the column
@functional - YES
@author - sondermanjj
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
};


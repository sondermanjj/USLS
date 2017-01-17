/**
@desc - On Spreadsheet open, creates the Testing menu
@functional - IN PROGRESS
@author - hendersonam

function onOpen() {
    var ui = SpreadsheetApp.getUi();
  
    //Create a new menu
    var testingMenu = ui.createMenu("Testing");
    testingMenu.addItem("Compare Sheets", "startComparing");
    testingMenu.addSeparator();
  
    //Add the menu to the menu bar
    testingMenu.addToUi();
  
}
*/

/**
@desc - 
@functional - IN PROGRESS
@author - hendersonam
*/
function startComparing() {
    var ui = SpreadsheetApp.getUi();
  
  
   //Prompt the user for a sheet name to clean
    var response = ui.prompt('Sheet Comparison', 'Please enter the name of the sheet you would like to compare to the currently open sheet.\nNote: Sheet names are listed on the bottom tabs.', ui.ButtonSet.OK_CANCEL);

   // Process the user's response.
    if (response.getSelectedButton() == ui.Button.OK) {
        var name = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(response.getResponseText());
        //var name = response.getResponseText();
        if(name != null) {
            compare(name);
        } else {
            ui.alert("Woops! That sheet does not exist. Please check for proper spelling and spacing and try again.");
        }
     } else if (response.getSelectedButton() == ui.Button.CANCEL) {
        Logger.log('The user canceled.');
     } else {
        Logger.log('The user clicked the close button in the dialog\'s title bar.');
     }
  
  
}


/**
@desc - 
@functional - IN PROGRESS
@author - hendersonam
*/
function compare(name) {
  
  
  
}


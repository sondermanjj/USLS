//JSHint verified 4/3/2017 sondermanjj

/**
 * @desc - On Spreadsheet open, creates the Add-On menu
 * @functional - yes
 * @author - hendersonam
 */
function onOpen() {
    var ui = SpreadsheetApp
      .getUi()
      .createMenu("Lunch Schedule Add-ons")
      .addItem("View Menu", "showSidebar");
      
    ui.addToUi();
}


/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var sidebar = HtmlService
    .createTemplateFromFile('Sidebar')
    .evaluate()
    .setTitle('USL Project Add-On');
  
  SpreadsheetApp.getUi().showSidebar(sidebar);
  Logger.log("Showing Sidebar");
}

/**
 * @desc 
 */
function doGet(request) {
  return HtmlService.createHtmlOutputFromFile('Sidebar')
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
}

/**
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

/**
 *@desc Takes the final student data (if it exists) and puts all the information in the "Website" sheet
 *@author sondermanjj
 */
function exportToWebsite() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    'Data Clean-Up', 
    'Please enter the name of the sheet that contains the data for the website. \n Note: Sheet names are listed on the bottom tabs.',
    ui.ButtonSet.OK_CANCEL);
    
  if(response.getSelectedButton() == ui.Button.OK){
    Logger.log("Exporting Data...");
    var sheetName = response.getResponseText();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if(sheet !== null){
      var data = sheet.getDataRange().getValues();
      var headers = getListOfColumns(data);
      var websiteHeaders = ["First Name", "Last Name","House", "Lunch Day", "Lunch Table", "Lunch Time"];
      var newData = [];
      var count = 0;
      var headLength = headers.length;
      var webHeadLength = websiteHeaders.length;
      var maxRows = sheet.getMaxRows();
      
      for (var i = 0; i < headLength; i++) {       
        for (var j = 0; j < webHeadLength; j++) {
        if (headers[i] == websiteHeaders[j]) {
          for (var k = 0; k < maxRows; k++) {
            if (count == 0) {
              newData.push([data[k][i]]);
            } else {
              newData[k][count] = data[k][i];
            }
          }
          count++;
        }
       }
      }
      if (count >= (websiteHeaders.length-1)) {
        createNewSheets(newData, "Website Info", SpreadsheetApp.getActiveSpreadsheet().getId());
        Logger.log("Data export succeeded");
      } else {
        ui.alert("That sheet didn't contain the right data, or the column headers might be wrong. Headers found: " + headers);
        Logger.log("Data export failed");
      }
      
    } else {
      ui.alert("Whoops! That sheet does not exist. Please check for proper spelling and spacing and try again.");
    }
  }
}





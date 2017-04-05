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





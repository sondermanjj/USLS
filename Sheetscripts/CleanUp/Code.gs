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
* Creates an HTML template from the file pointed to so that it can be included in other pages
* @param filename Name of the HTML file to be generated as a template
* @return partial HTML template of the page passed in
*/
function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}


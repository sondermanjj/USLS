//JSHint verified 4/3/2017 sondermanjj

/*
* @desc - Shows the loading dialog to the users, stopping them from doing input.
* @params - x Dialog that will be shown
* @author - clemensam
*/
function showDialog(x) {
  var button = x;
  var html = HtmlService.createHtmlOutputFromFile('LoadingDialog')
  .setWidth(150)
  .setHeight(170);
  html.append("<p id='button'>" + x + "</p></body></html>");
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  .showModalDialog(html, ' '); 
}

/*
* @desc - Imports the item into the HTML Service, allowing the use of the dialog.
* @author - clemensam
*/
function doGet() {
  return HtmlService.createTemplateFromFile('LoadingDialog').evaluate()
      .setTitle('Simple Tasks')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
/*
* @desc - determines what methods need to be called based on the button that was pressed to open the load dialog
* @params - args Comma separated string with the first naming the button pressed and the 
*           remianing being any args needed to be passed to the corresoponding method for 
*           that button
* @author - clemensam
*/
function callMethod(args) {
  Logger.log(args);
  var params = args.split(", ");
  var button = params[0];
  switch(button){
    case 'l': case 'n': case 'j': case 'k': case 't': case 'g': case 'p':
      sort(button);
      break;
    case 'sort':
      sort(params.toString());
    case 'show':
      showAllValues();
      break;
    case 'sc':
      updateChanges();
      getStatistics();
      var stats = getStatisticsHTML();
      break;
    case 'search':
      var filter = params[1].toString();
      var column = params[2].toString();
      var sheetName = params[3].toString();
      hideValues(filter, column, sheetName);
      break;
    case 'clean':
      var sheetName = params[1];
      cleanUp(sheetName);
      assignStudentLunchDays();
      addFacultyTables();
      break;
  }
}

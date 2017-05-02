
function showDialog(x) {
  var button = x;
  var html = HtmlService.createHtmlOutputFromFile('LoadingDialog')
  .setWidth(150)
  .setHeight(170);
  html.append("<p id='button'>" + x + "</p></body></html>");
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  .showModalDialog(html, ' '); 
}

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
  var params = args.split(", ");
  Logger.log(params);
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
      Logger.log("Updated");
      getStatistics();
      Logger.log("Got Statistics");
      var stats = getStatisticsHTML();
      break;
    case 'search':
      var filter = params[1].toString();
      var column = params[2].toString();
      hideValues(filter, column);
      break;
    case 'clean':
      var sheetName = params[1];
      cleanUp(sheetName);
      assignStudentLunchDays();
      addFacultyTables();
      break;
  }
}

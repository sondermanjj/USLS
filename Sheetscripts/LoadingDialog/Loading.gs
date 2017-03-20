
function showDialog(x) {
  //Logger.log("Dialog. Value of x: " + x);
  var button = x;
  var html = HtmlService.createHtmlOutputFromFile('LoadingDialog')
  .setWidth(150)
  .setHeight(70);
  html.append("<p id='button'>" + x + "</p></body></html>");
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  .showModalDialog(html, ' '); 
  //Logger.log("html: " + html.getContent());
}

function doGet() {
  return HtmlService.createTemplateFromFile('LoadingDialog').evaluate()
      .setTitle('Simple Tasks')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function callMethod(args) {
  Logger.log(args.split(", "));
  var params = args.split(", ");
  var button = params[0];
  switch(button){
    case 'l': case 'n': case 'j': case 'k': case 't': case 'g': case 'p':
      sort(button);
      break;
    case 'show':
      showAllValues();
      break;
    case 'scan':
      break;
    case 'search':
      var filter = params[1].toString();
      var column = params[2].toString();
      Logger.log(filter);
      Logger.log(column);
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

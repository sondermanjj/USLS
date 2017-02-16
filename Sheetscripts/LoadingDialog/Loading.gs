
function showDialog() {
  var html = HtmlService.createHtmlOutputFromFile('LoadingDialog')
  .setWidth(150)
  .setHeight(60)
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  .showModelessDialog(html, ' ');    

}

function doGet() {
  return HtmlService.createTemplateFromFile('LoadingDialog').evaluate()
      .setTitle('Simple Tasks')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

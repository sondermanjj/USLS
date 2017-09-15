function showScheduleChangesPrompt() {
  var html = HtmlService.createHtmlOutputFromFile('ScheduleChangesPrompt').setWidth(250).setHeight(150);
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}
